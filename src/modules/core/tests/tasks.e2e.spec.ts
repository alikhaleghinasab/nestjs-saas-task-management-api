import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'http';
import { DataSource } from 'typeorm';
import { AppModule } from 'app.module';
import { OrganizationFactory } from '@organizations/database/factories/organization.factory';
import { ProjectFactory } from '@projects/database/factories/project.factory';
import { TaskFactory } from '@tasks/database/factories/task.factory';

import { ApiClient } from './helpers/api-e2e.helper';
import { initializeTransactionalContext } from 'typeorm-transactional';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { clearDatabase } from 'tests/utils/database-cleaner';
import { API_GLOBAL_PREFIX } from '@common/constants/api.constants';

describe('Tasks (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let server: Server;
  let apiClient: ApiClient;

  let orgFactory: ReturnType<typeof OrganizationFactory>;
  let projectFactory: ReturnType<typeof ProjectFactory>;
  let taskFactory: ReturnType<typeof TaskFactory>;

  beforeAll(async () => {
    initializeTransactionalContext();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    dataSource = moduleRef.get(DataSource);

    orgFactory = OrganizationFactory(dataSource);
    projectFactory = ProjectFactory(dataSource);
    taskFactory = TaskFactory(dataSource);

    app.setGlobalPrefix(API_GLOBAL_PREFIX);

    const fastifyInstance = app.getHttpAdapter().getInstance();
    await fastifyInstance.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET,
    });

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    server = app.getHttpServer();

    apiClient = new ApiClient(server);
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }

    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  async function setupTenantWorkflow(userPrefix: string) {
    const ownerRes = await apiClient.auth
      .register({
        firstName: 'Test',
        lastName: 'User',
        email: `${userPrefix}-${crypto.randomUUID()}@example.com`,
        password: 'StrongPass123!',
      })
      .expect(201);

    const token = ownerRes.body.data.accessToken;

    const tenantClient = new ApiClient(server).setAccessToken(token);

    const organization = await orgFactory.buildPlain();
    const orgRes = await tenantClient.organizations
      .create(organization)
      .expect(201);
    const tenantId = orgRes.body.data.id;

    tenantClient.setTenantId(tenantId);

    const project = await projectFactory.buildPlain({
      organizationId: tenantId,
    });
    const projectRes = await tenantClient.projects
      .create({
        name: project.name,
        description: project.description,
      })
      .expect(201);
    const projectId = projectRes.body.data.id;

    const taskPayload = await taskFactory.buildPlain({ projectId });
    const taskRes = await tenantClient.tasks.create(taskPayload).expect(201);
    const taskId = taskRes.body.data.id;

    return { tenantClient, tenantId, projectId, taskId, taskRes };
  }

  it('completes tenant task workflow', async () => {
    const { tenantClient, tenantId, projectId, taskRes } =
      await setupTenantWorkflow('workflow');

    const tasksRes = await tenantClient.tasks.getAll().expect(200);

    expect(taskRes.body.data.projectId).toBe(projectId);
    expect(taskRes.body.data.organizationId).toBe(tenantId);
    expect(tasksRes.body.data).toHaveLength(1);
  });

  it('isolates task access between different tenants', async () => {
    const { taskId } = await setupTenantWorkflow('tenant1');
    const anotherTenant = await setupTenantWorkflow('tenant2');

    await anotherTenant.tenantClient.tasks.getById(taskId).expect(404);
  });
});

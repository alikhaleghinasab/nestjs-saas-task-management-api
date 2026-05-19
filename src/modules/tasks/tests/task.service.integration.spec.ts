import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule } from 'app.module';
import { TaskService } from '@tasks/services/task.service';
import { Task } from '@tasks/entities/task.entity';
import { DynamicFilterDto } from '@common/dto/dynamic-filter.dto';
import { OrganizationFactory } from '@organizations/database/factories/organization.factory';
import { ProjectFactory } from '@projects/database/factories/project.factory';
import { TaskFactory } from '@tasks/database/factories/task.factory';
import { clearDatabase } from 'tests/utils/database-cleaner';
import { initializeTransactionalContext } from 'typeorm-transactional';

describe('TaskService - Multi-Tenancy Data Isolation', () => {
  let dataSource: DataSource;
  let taskService: TaskService;

  let orgFactory: ReturnType<typeof OrganizationFactory>;
  let projectFactory: ReturnType<typeof ProjectFactory>;
  let taskFactory: ReturnType<typeof TaskFactory>;

  const defaultDto: DynamicFilterDto = {
    page: 1,
    limit: 10,
  };

  async function seedMultiTenantScenario() {
    const orgA = await orgFactory.create();
    const orgB = await orgFactory.create();
    const projectA = await projectFactory.create({ organizationId: orgA.id });
    const projectB = await projectFactory.create({ organizationId: orgB.id });
    const orgATasks = await taskFactory.createMany(2, {
      organizationId: orgA.id,
      projectId: projectA.id,
    });
    const orgBTasks = await taskFactory.createMany(3, {
      organizationId: orgB.id,
      projectId: projectB.id,
    });

    return { orgA, orgB, orgATasks, orgBTasks };
  }

  beforeAll(async () => {
    initializeTransactionalContext();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    dataSource = moduleFixture.get(DataSource);
    taskService = moduleFixture.get(TaskService);
    orgFactory = OrganizationFactory(dataSource);
    projectFactory = ProjectFactory(dataSource);
    taskFactory = TaskFactory(dataSource);
  });

  beforeEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('findMany()', () => {
    it('should isolate tenant data between organizations', async () => {
      // Arrange
      const { orgA, orgB, orgATasks, orgBTasks } =
        await seedMultiTenantScenario();

      // Act
      const result = await taskService.findMany(defaultDto, orgA.id);
      const { data } = result;

      // Assert
      expect(data).toHaveLength(2);
      expect(result.meta.total).toBe(2);

      expect(data.every((task: Task) => task.organizationId === orgA.id)).toBe(
        true,
      );
      expect(data.some((task: Task) => task.organizationId === orgB.id)).toBe(
        false,
      );
    });
  });
});

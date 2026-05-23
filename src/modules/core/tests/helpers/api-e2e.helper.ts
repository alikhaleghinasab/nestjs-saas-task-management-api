import request, { Test } from 'supertest';
import { Server } from 'http';
import { RegisterDto } from '@auth/dto/register.dto';
import { CreateOrganizationDto } from '@organizations/dto/create-organization.dto';
import { CreateProjectDto } from '@projects/dto/create-project.dto';
import { CreateTaskDto } from '@tasks/dto/create-task.dto';
import { API_GLOBAL_PREFIX } from '@common/constants/api.constants';
import { TENANT_HEADER_NAME } from '@organizations/constants/tenant.constant';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export class ApiClient {
  private accessToken?: string;
  private tenantId?: string;

  constructor(private readonly server: Server) {}

  setAccessToken(token: string): this {
    this.accessToken = token;
    return this;
  }

  setTenantId(tenantId: string): this {
    this.tenantId = tenantId;
    return this;
  }

  private buildRequest(method: HttpMethod, path: string): Test {
    const req = request(this.server)[method](`${API_GLOBAL_PREFIX}${path}`);
    console.log(`${API_GLOBAL_PREFIX}${path}`);

    if (this.accessToken) {
      req.set('Authorization', `Bearer ${this.accessToken}`);
    }
    if (this.tenantId) {
      req.set(TENANT_HEADER_NAME, this.tenantId);
    }

    return req;
  }

  auth = {
    register: (payload: RegisterDto) =>
      this.buildRequest('post', '/auth/register').send(payload),
  };

  organizations = {
    create: (payload: CreateOrganizationDto) =>
      this.buildRequest('post', '/organizations').send(payload),
  };

  projects = {
    create: (payload: CreateProjectDto) =>
      this.buildRequest('post', '/projects').send(payload),
  };

  tasks = {
    create: (payload: CreateTaskDto) =>
      this.buildRequest('post', '/tasks').send(payload),

    getAll: (query: Record<string, any> = { page: 1, limit: 10 }) =>
      this.buildRequest('get', '/tasks').query(query),

    getById: (taskId: string) => this.buildRequest('get', `/tasks/${taskId}`),
  };
}

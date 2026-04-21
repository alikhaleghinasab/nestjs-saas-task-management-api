import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import {
  CreateTaskParams,
  UpdateTaskParams,
} from '../interfaces/task-params.interface';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { withOrg } from '@organizations/utils/with-org.util';
import { paginate } from '@common/utils/database/paginate.util';
import { EnsureFound } from '@common/decorators/ensure-found.decorator';
import { EnsureAffected } from '@common/decorators/ensure-affected.decorator';
import { wasAffected } from '@common/utils/database/ensure-affected.util';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
  ) {}

  async findMany(
    dto: PaginationDto,
    organizationId: string,
  ): Promise<PaginatedResponse<Task>> {
    return paginate(this.repo, dto, withOrg({}, organizationId));
  }

  @EnsureFound()
  async findOne(id: string, organizationId: string): Promise<Task> {
    return this.repo.findOneBy(withOrg({ id }, organizationId));
  }

  async create(data: CreateTaskParams): Promise<Task> {
    const task = this.repo.create(data);
    return this.repo.save(task);
  }

  @EnsureAffected()
  async update(
    id: string,
    organizationId: string,
    data: UpdateTaskParams,
  ): Promise<boolean> {
    const task = this.repo.create(data);
    return await wasAffected(
      this.repo.update(withOrg({ id }, organizationId), task),
    );
  }

  @EnsureAffected()
  async delete(id: string, organizationId: string): Promise<boolean> {
    return wasAffected(this.repo.delete(withOrg({ id }, organizationId)));
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import {
  CreateTaskParams,
  UpdateTaskParams,
} from '../interfaces/task-params.interface';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { EnsureFound } from '@common/decorators/ensure-found.decorator';
import { EnsureAffected } from '@common/decorators/ensure-affected.decorator';
import { wasAffected } from '@common/utils/database/ensure-affected.util';
import { CatchUniqueConstraint } from '@common/decorators/catch-unique-constraint.decorator';
import { TASK_ERRORS } from '@tasks/constants/errors.constant';
import { CatchForeignKeyConstraint } from '@common/decorators/catch-foreign-key.decorator';
import { DynamicFilterDto } from '@common/dto/dynamic-filter.dto';
import { dynamicFilterBuildWhere } from '@common/utils/database/dynamic-filter.util';
import { TenantBaseRepository } from '@organizations/repositories/tenant-base.repository';
import { withOrg } from '@organizations/utils/with-org.util';
@Injectable()
export class TaskRepository extends TenantBaseRepository<Task> {
  private static readonly allowedFilterFields: Array<keyof Task & string> = [
    'title',
    'status',
    'priority',
    'dueDate',
    'projectId',
    'assigneeId',
    'createdBy',
    'createdAt',
  ] as const;

  constructor(
    @InjectRepository(Task)
    protected readonly repo: Repository<Task>,
  ) {
    super();
  }

  async findMany(
    dto: DynamicFilterDto,
    organizationId: string,
  ): Promise<PaginatedResponse<Task>> {
    const filters = dynamicFilterBuildWhere<Task>(
      dto,
      TaskRepository.allowedFilterFields,
    );
    return this.paginate({
      paginationDto: dto,
      where: filters,
      organizationId,
    });
  }

  @EnsureFound()
  async findOne(id: string, organizationId: string): Promise<Task> {
    return this.repo.findOneBy(withOrg({ id }, organizationId));
  }

  @CatchForeignKeyConstraint({
    project_id: 'project',
    assignee_id: 'assigned user',
  })
  @CatchUniqueConstraint(TASK_ERRORS.TASK_EXISTS)
  async create(data: CreateTaskParams): Promise<Task> {
    const task = this.repo.create(data);
    return this.repo.save(task);
  }

  @CatchForeignKeyConstraint({
    project_id: 'project',
    assignee_id: 'assigned user',
  })
  @CatchUniqueConstraint(TASK_ERRORS.TASK_EXISTS)
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
    return wasAffected(this.repo.softDelete(withOrg({ id }, organizationId)));
  }
}

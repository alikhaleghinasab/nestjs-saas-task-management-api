import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskInterface } from '../interfaces/task-params.interface';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { withOrg } from '@organizations/utils/with-org.util';
import { paginate } from '@common/utils/database/paginate.util';

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

  async create(data: CreateTaskInterface): Promise<Task> {
    const task = this.repo.create(data);
    return this.repo.save(task);
  }
}

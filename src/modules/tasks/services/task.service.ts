import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';
import { TaskStatus } from '../enums/task.enum';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findMany(
    dto: PaginationDto,
    organizationId: string,
  ): Promise<PaginatedResponse<Task>> {
    return this.taskRepository.findMany(dto, organizationId);
  }

  async create(
    dto: CreateTaskDto,
    userId: string,
    organizationId: string,
  ): Promise<Task> {
    return this.taskRepository.create({
      ...dto,
      status: dto.status || TaskStatus.TODO,
      createdBy: userId,
      organizationId,
    });
  }
}

import { Injectable } from '@nestjs/common';

import { TaskRepository } from '../repositories/task.repository';

import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

import { Task } from '../entities/task.entity';
import { TaskStatus } from '../enums/task.enum';

import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { DynamicFilterDto } from '@common/dto/dynamic-filter.dto';
import { MembershipAccessService } from '@memberships/services/membership-access.service';
import { ProjectAccessService } from '@projects/services/project-access.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly membershipAccessService: MembershipAccessService,
    private readonly projectAccessService: ProjectAccessService,
  ) {}

  async findMany(
    dto: DynamicFilterDto,
    organizationId: string,
  ): Promise<PaginatedResponse<Task>> {
    return this.taskRepository.findMany(dto, organizationId);
  }

  async findOne(id: string, organizationId: string): Promise<Task> {
    return this.taskRepository.findOne(id, organizationId);
  }

  async create(
    dto: CreateTaskDto,
    userId: string,
    organizationId: string,
  ): Promise<Task> {
    await this.validateRelations(dto, organizationId);

    return this.taskRepository.create({
      ...dto,
      status: dto.status ?? TaskStatus.TODO,
      createdBy: userId,
      organizationId,
    });
  }

  async update(
    id: string,
    organizationId: string,
    dto: UpdateTaskDto,
  ): Promise<boolean> {
    await this.validateRelations(dto, organizationId);

    return this.taskRepository.update(id, organizationId, dto);
  }

  async delete(id: string, organizationId: string): Promise<boolean> {
    return this.taskRepository.delete(id, organizationId);
  }

  private async validateRelations(
    dto: { projectId?: string; assigneeId?: string },
    organizationId: string,
  ): Promise<void> {
    if (dto.projectId) {
      await this.projectAccessService.ensureProjectBelongsToOrganization(
        dto.projectId,
        organizationId,
      );
    }

    if (dto.assigneeId) {
      await this.membershipAccessService.ensureUserBelongsToOrganization(
        dto.assigneeId,
        organizationId,
      );
    }
  }
}

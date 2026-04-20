import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from '@projects/dto/create-project.dto';
import { Project } from '@projects/entities/project.entity';
import { ProjectRepository } from '@projects/repositories/project.repository';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async findMany(
    dto: PaginationDto,
    organizationId: string,
  ): Promise<PaginatedResponse<Project>> {
    return this.projectRepository.findMany(dto, organizationId);
  }

  async create(
    dto: CreateProjectDto,
    userId: string,
    organizationId: string,
  ): Promise<Project> {
    return this.projectRepository.create({ ...dto, userId, organizationId });
  }
}

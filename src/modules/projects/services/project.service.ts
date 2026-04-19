import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from '@projects/dto/create-project.dto';
import { Project } from '@projects/entities/project.entity';
import { ProjectRepository } from '@projects/repositories/project.repository';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async create(
    dto: CreateProjectDto,
    userId: string,
    organizationId: string,
  ): Promise<Project> {
    return this.projectRepository.create({ ...dto, userId, organizationId });
  }
}

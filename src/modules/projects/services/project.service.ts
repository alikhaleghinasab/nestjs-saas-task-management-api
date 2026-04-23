import { CacheVersionService } from '@cache/cache-version.service';
import { CacheHelper } from '@cache/cache.helper';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from '@projects/dto/create-project.dto';
import { Project } from '@projects/entities/project.entity';
import { ProjectRepository } from '@projects/repositories/project.repository';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly cacheHelper: CacheHelper,
    private readonly cacheVersion: CacheVersionService,
  ) {}

  async findMany(
    dto: PaginationDto,
    organizationId: string,
  ): Promise<PaginatedResponse<Project>> {
    const version = await this.cacheVersion.get('project', organizationId);

    const key = `project:${organizationId}:v${version}:page=${dto.page}:limit=${dto.limit}`;

    return this.cacheHelper.getOrSetJson(
      key,
      () => this.projectRepository.findMany(dto, organizationId),
      180,
    );
  }

  async create(
    dto: CreateProjectDto,
    userId: string,
    organizationId: string,
  ): Promise<Project> {
    const project = await this.projectRepository.create({
      ...dto,
      userId,
      organizationId,
    });

    await this.cacheVersion.bump('project', organizationId);

    return project;
  }
}

import { CatchUniqueConstraint } from '@common/decorators/catch-unique-constraint.decorator';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TenantBaseRepository } from '@organizations/repositories/tenant-base.repository';
import { PROJECT_ERRORS } from '@projects/constants/errors.constant';
import { Project } from '@projects/entities/project.entity';
import { CreateProjectParams } from '@projects/interfaces/project-params.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectRepository extends TenantBaseRepository<Project> {
  constructor(
    @InjectRepository(Project)
    protected readonly repo: Repository<Project>,
  ) {
    super();
  }

  async findMany(
    dto: PaginationDto,
    organizationId: string,
  ): Promise<PaginatedResponse<Project>> {
    return this.paginate({ paginationDto: dto, organizationId });
  }

  @CatchUniqueConstraint(PROJECT_ERRORS.PROJECT_EXISTS)
  async create(data: CreateProjectParams): Promise<Project> {
    const project = this.repo.create(data);
    return this.repo.save(project);
  }
}

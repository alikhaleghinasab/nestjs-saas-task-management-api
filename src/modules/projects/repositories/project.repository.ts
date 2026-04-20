import { CatchUniqueConstraint } from '@common/decorators/catch-unique-constraint.decorator';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { paginate } from '@common/utils/database/paginate.util';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { withOrg } from '@organizations/utils/with-org.util';
import { PROJECT_ERRORS } from '@projects/constants/errors.constant';
import { Project } from '@projects/entities/project.entity';
import { CreateProjectParams } from '@projects/interfaces/project-params.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly repo: Repository<Project>,
  ) {}

  async findMany(
    dto: PaginationDto,
    organizationId: string,
  ): Promise<PaginatedResponse<Project>> {
    return paginate(this.repo, dto, withOrg({}, organizationId));
  }

  @CatchUniqueConstraint(PROJECT_ERRORS.PROJECT_EXISTS)
  async create(data: CreateProjectParams): Promise<Project> {
    const project = this.repo.create(data);
    return this.repo.save(project);
  }
}

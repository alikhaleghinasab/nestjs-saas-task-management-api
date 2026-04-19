import { CatchUniqueConstraint } from '@common/decorators/catch-unique-constraint.decorator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  @CatchUniqueConstraint(PROJECT_ERRORS.PROJECT_EXISTS)
  async create(data: CreateProjectParams): Promise<Project> {
    const project = this.repo.create(data);
    return this.repo.save(project);
  }
}

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PROJECT_ERRORS } from '@projects/constants/errors.constant';
import { ProjectRepository } from '@projects/repositories/project.repository';

@Injectable()
export class ProjectAccessService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async ensureProjectBelongsToOrganization(
    projectId: string,
    organizationId: string,
  ): Promise<void> {
    const exists = await this.projectRepository.existsInOrganization(
      projectId,
      organizationId,
    );

    if (!exists) {
      throw new ForbiddenException(
        PROJECT_ERRORS.PROJECT_ORGANIZATION_MISMATCH,
      );
    }
  }
}

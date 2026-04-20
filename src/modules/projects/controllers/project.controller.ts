import { ApiCreate, ApiGetMany } from '@common/decorators/api-crud.decorator';
import { PaginationDto } from '@common/dto/pagination.dto';
import { ApiSuccessResponseInterceptor } from '@common/interceptors/api-success-response.interceptor';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { Roles } from '@memberships/enums/roles.enum';
import { Body, Controller, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrganizationId } from '@organizations/decorators/organization-id.decorator';
import { PROJECT_ERRORS } from '@projects/constants/errors.constant';
import { CreateProjectDto } from '@projects/dto/create-project.dto';
import { Project } from '@projects/entities/project.entity';
import { ProjectService } from '@projects/services/project.service';
import {
  OrganizationProtected,
  TenantHeader,
} from '@users/decorators/organization-roles.decorator';
import { CurrentUser } from '@users/decorators/user.decorator';

const resourceName = 'Project';

@Controller('projects')
@UseInterceptors(ApiSuccessResponseInterceptor)
@ApiTags(resourceName)
@ApiBearerAuth()
@TenantHeader()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiGetMany({
    entity: Project,
    resourceName,
  })
  @OrganizationProtected(Roles.Owner, Roles.Admin, Roles.Member)
  async findMany(
    @Query() dto: PaginationDto,
    @OrganizationId() organizationId: string,
  ): Promise<PaginatedResponse<Project>> {
    return this.projectService.findMany(dto, organizationId);
  }

  @ApiCreate({
    entity: Project,
    resourceName,
    duplicateErrorMsg: PROJECT_ERRORS.PROJECT_EXISTS,
  })
  @OrganizationProtected(Roles.Owner, Roles.Admin)
  create(
    @Body() dto: CreateProjectDto,
    @CurrentUser('id') userId: string,
    @OrganizationId() organizationId: string,
  ): Promise<Project> {
    return this.projectService.create(dto, userId, organizationId);
  }
}

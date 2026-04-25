import {
  ApiCreate,
  ApiDelete,
  ApiGetMany,
  ApiGetOne,
  ApiUpdate,
} from '@common/decorators/api-crud.decorator';
import { ApiSuccessResponseInterceptor } from '@common/interceptors/api-success-response.interceptor';
import { Roles } from '@memberships/enums/roles.enum';
import { Body, Controller, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrganizationId } from '@organizations/decorators/organization-id.decorator';
import {
  OrganizationProtected,
  TenantHeader,
} from '@organizations/decorators/organization-roles.decorator';
import { CurrentUser } from '@users/decorators/user.decorator';
import { TaskService } from '../services/task.service';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { UuidParam } from '@common/decorators/uuid-param.decorator';
import { UpdateTaskDto } from '@tasks/dto/update-task.dto';
import { DynamicFilterDto } from '@common/dto/dynamic-filter.dto';
import { ApiDynamicFilters } from '@common/decorators/api-dynamic-filters.decorator';

const resourceName = 'Task';

@Controller('tasks')
@ApiTags(resourceName)
@ApiBearerAuth()
@TenantHeader()
@ApiDynamicFilters()
@UseInterceptors(ApiSuccessResponseInterceptor)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiGetMany({
    entity: Task,
    resourceName,
  })
  @OrganizationProtected(Roles.Owner, Roles.Admin, Roles.Member)
  async findMany(
    @Query() dto: DynamicFilterDto,
    @OrganizationId() organizationId: string,
  ): Promise<PaginatedResponse<Task>> {
    return this.taskService.findMany(dto, organizationId);
  }

  @ApiGetOne({
    entity: Task,
    resourceName,
  })
  @OrganizationProtected(Roles.Owner, Roles.Admin, Roles.Member)
  async findOne(
    @UuidParam() id: string,
    @OrganizationId() organizationId: string,
  ): Promise<Task> {
    return this.taskService.findOne(id, organizationId);
  }

  @ApiCreate({
    entity: Task,
    resourceName,
  })
  @OrganizationProtected(Roles.Owner, Roles.Admin, Roles.Member)
  create(
    @Body() dto: CreateTaskDto,
    @CurrentUser('id') userId: string,
    @OrganizationId() organizationId: string,
  ): Promise<Task> {
    return this.taskService.create(dto, userId, organizationId);
  }

  @ApiUpdate({
    resourceName,
  })
  @OrganizationProtected(Roles.Owner, Roles.Admin, Roles.Member)
  async update(
    @UuidParam() id: string,
    @OrganizationId() organizationId: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<void> {
    await this.taskService.update(id, organizationId, dto);
  }

  @ApiDelete({
    resourceName,
  })
  @OrganizationProtected(Roles.Owner, Roles.Admin)
  async delete(
    @UuidParam('id') id: string,
    @OrganizationId() organizationId: string,
  ): Promise<void> {
    await this.taskService.delete(id, organizationId);
  }
}

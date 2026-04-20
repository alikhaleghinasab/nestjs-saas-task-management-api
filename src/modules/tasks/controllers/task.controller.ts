import { ApiCreate } from '@common/decorators/api-crud.decorator';
import { ApiSuccessResponseInterceptor } from '@common/interceptors/api-success-response.interceptor';
import { Roles } from '@memberships/enums/roles.enum';
import { Body, Controller, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrganizationId } from '@organizations/decorators/organization-id.decorator';
import {
  OrganizationProtected,
  TenantHeader,
} from '@users/decorators/organization-roles.decorator';
import { CurrentUser } from '@users/decorators/user.decorator';
import { TaskService } from '../services/task.service';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';

const resourceName = 'Task';

@Controller('tasks')
@UseInterceptors(ApiSuccessResponseInterceptor)
@ApiTags(resourceName)
@ApiBearerAuth()
@TenantHeader()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

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
}

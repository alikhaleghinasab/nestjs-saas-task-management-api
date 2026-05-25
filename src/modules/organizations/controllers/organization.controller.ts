import {
  ApiDelete,
  ApiCreate,
  ApiGetMany,
  ApiGetOne,
  ApiUpdate,
} from '@common/decorators/api-crud.decorator';
import { PaginationDto } from '@common/dto/pagination.dto';
import { ApiSuccessResponseInterceptor } from '@common/interceptors/api-success-response.interceptor';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { Roles } from '@memberships/enums/roles.enum';
import { Body, Controller, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';
import { OrganizationId } from '@organizations/decorators/organization-id.decorator';
import { CreateOrganizationDto } from '@organizations/dto/create-organization.dto';
import { UpdateOrganizationDto } from '@organizations/dto/update-organization.dto';
import { Organization } from '@organizations/entities/organization.entity';
import { OrganizationService } from '@organizations/services/organization.service';
import {
  OrganizationProtected,
  TenantParam,
} from '@organizations/decorators/organization-roles.decorator';
import { CurrentUserId } from '@users/decorators/user.decorator';
import { TENANT_PARAM_NAME } from '@organizations/constants/tenant.constant';

const resourceName = 'Organization';

@Controller('organizations')
@UseInterceptors(ApiSuccessResponseInterceptor)
@ApiTags(resourceName)
@ApiBearerAuth()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiGetMany({
    entity: Organization,
    resourceName,
  })
  async findMany(
    @Query() dto: PaginationDto,
    @CurrentUserId() userId: string,
  ): Promise<PaginatedResponse<Organization>> {
    return this.organizationService.findMany(dto, userId);
  }

  @ApiGetOne({
    paramName: TENANT_PARAM_NAME,
    entity: Organization,
    resourceName,
  })
  @OrganizationProtected(Roles.Owner, Roles.Admin, Roles.Member)
  @TenantParam()
  async findOne(@OrganizationId() id: string): Promise<Organization> {
    return this.organizationService.findOne(id);
  }

  @ApiCreate({
    entity: Organization,
    resourceName,
    duplicateErrorMsg: ORGANIZATION_ERRORS.SLUG_EXISTS,
  })
  create(
    @Body() dto: CreateOrganizationDto,
    @CurrentUserId() userId: string,
  ): Promise<Organization> {
    return this.organizationService.create(dto, userId);
  }

  @ApiUpdate({
    paramName: TENANT_PARAM_NAME,
    resourceName,
    duplicateErrorMsg: ORGANIZATION_ERRORS.SLUG_EXISTS,
  })
  @OrganizationProtected(Roles.Owner, Roles.Admin)
  @TenantParam()
  async update(
    @OrganizationId() id: string,
    @Body() dto: UpdateOrganizationDto,
  ): Promise<void> {
    await this.organizationService.update(id, dto);
  }

  @ApiDelete({
    paramName: TENANT_PARAM_NAME,
    resourceName,
  })
  @OrganizationProtected(Roles.Owner)
  @TenantParam()
  async delete(
    @OrganizationId() id: string,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    await this.organizationService.delete(id, userId);
  }
}

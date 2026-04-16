import {
  ApiDelete,
  ApiCreate,
  ApiGetMany,
  ApiGetOne,
  ApiUpdate,
} from '@common/decorators/api-crud.decorator';
import { UuidParam } from '@common/decorators/uuid-param.decorator';
import { PaginationDto } from '@common/dto/pagination.dto';
import { ApiSuccessResponseInterceptor } from '@common/interceptors/api-success-response.interceptor';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { Body, Controller, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';
import { CreateOrganizationDto } from '@organizations/dto/create-organization.dto';
import { UpdateOrganizationDto } from '@organizations/dto/update-organization.dto';
import { Organization } from '@organizations/entities/organization.entity';
import { OrganizationService } from '@organizations/services/organization.service';

const resourceName = 'Organization';

@Controller('organizations')
@UseInterceptors(ApiSuccessResponseInterceptor)
@ApiTags(resourceName)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiGetMany({
    entity: Organization,
    resourceName,
  })
  async findMany(
    @Query() dto: PaginationDto,
  ): Promise<PaginatedResponse<Organization>> {
    return this.organizationService.findMany(dto);
  }

  @ApiGetOne({
    entity: Organization,
    resourceName,
  })
  async findOne(@UuidParam() id: string): Promise<Organization> {
    return this.organizationService.findOne(id);
  }

  @ApiCreate({
    entity: Organization,
    resourceName,
    duplicateErrorMsg: ORGANIZATION_ERRORS.SLUG_EXISTS,
  })
  create(@Body() dto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationService.create(dto);
  }

  @ApiUpdate({
    resourceName,
    duplicateErrorMsg: ORGANIZATION_ERRORS.SLUG_EXISTS,
  })
  async update(
    @UuidParam() id: string,
    @Body() dto: UpdateOrganizationDto,
  ): Promise<void> {
    await this.organizationService.update(id, dto);
  }

  @ApiDelete({
    resourceName,
  })
  async delete(@UuidParam() id: string): Promise<void> {
    await this.organizationService.delete(id);
  }
}

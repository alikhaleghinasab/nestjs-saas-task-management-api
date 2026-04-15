import { JwtAuth } from '@auth/decorators/auth.decorator';
import { ApiErrorResponsesDocs } from '@common/decorators/api-error-response-docs.decorator';
import { ApiPaginatedResponseDocs } from '@common/decorators/api-paginated-response-docs.decorator';
import { ApiSuccessResponseDocs } from '@common/decorators/api-success-response-docs.decorator';
import { PaginationDto } from '@common/dto/pagination.dto';
import { EntityNotFoundException } from '@common/exceptions/entity-not-found.exception';
import { UniqueConstraintException } from '@common/exceptions/unique-constraint.exception';
import { ApiPaginatedResponseInterceptor } from '@common/interceptors/api-paginated-response.interceptor';
import { ApiSuccessResponseInterceptor } from '@common/interceptors/api-success-response.interceptor';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';
import { CreateOrganizationDto } from '@organizations/dto/create-organization.dto';
import { UpdateOrganizationDto } from '@organizations/dto/update-organization.dto';
import { Organization } from '@organizations/entities/organization.entity';
import { OrganizationService } from '@organizations/services/organization.service';

@Controller('organizations')
@UseInterceptors(ApiSuccessResponseInterceptor)
@ApiTags('Organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @JwtAuth()
  @ApiOperation({ summary: 'Get organizations' })
  @ApiPaginatedResponseDocs({
    model: Organization,
    description: 'Paginated list of organizations',
  })
  @UseInterceptors(ApiPaginatedResponseInterceptor)
  async findMany(
    @Query() dto: PaginationDto,
  ): Promise<PaginatedResponse<Organization>> {
    return this.organizationService.findMany(dto);
  }

  @Get(':id')
  @JwtAuth()
  @ApiOperation({ summary: 'Get organization' })
  @ApiSuccessResponseDocs({
    model: Organization,
    description: 'Organization details retrieved',
  })
  @ApiErrorResponsesDocs(EntityNotFoundException)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Organization> {
    return this.organizationService.findOne(id);
  }
  @Post()
  @JwtAuth()
  @ApiOperation({ summary: 'Create organization' })
  @ApiSuccessResponseDocs({
    status: 201,
    model: Organization,
    description: 'Organization created',
  })
  @ApiErrorResponsesDocs({
    exception: UniqueConstraintException,
    message: ORGANIZATION_ERRORS.SLUG_EXISTS,
  })
  create(@Body() dto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationService.create(dto);
  }

  @Put(':id')
  @HttpCode(200)
  @JwtAuth()
  @ApiOperation({ summary: 'Update organization' })
  @ApiSuccessResponseDocs({ description: 'Organization updated' })
  @ApiErrorResponsesDocs({
    exception: UniqueConstraintException,
    message: ORGANIZATION_ERRORS.SLUG_EXISTS,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizationDto,
  ): Promise<void> {
    await this.organizationService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @JwtAuth()
  @ApiOperation({ summary: 'Delete organization' })
  @ApiSuccessResponseDocs({ description: 'Organization deleted' })
  @ApiErrorResponsesDocs(EntityNotFoundException)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.organizationService.delete(id);
  }
}

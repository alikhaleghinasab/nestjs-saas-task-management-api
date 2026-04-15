import { JwtAuth } from '@auth/decorators/auth.decorator';
import { ApiErrorResponsesDocs } from '@common/decorators/api-error-response-docs';
import { ApiSuccessResponseDocs } from '@common/decorators/api-success-response-docs.decorator';
import { UniqueConstraintException } from '@common/exceptions/unique-constraint.exception';
import { ApiSuccessResponseInterceptor } from '@common/interceptors/api-success-response.interceptor';
import { ApiErrorResponse } from '@common/responses/api-error-response.dto';
import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrganizationDto } from '@organizations/dto/create-organization.dto';
import { Organization } from '@organizations/entities/organization.entity';
import { OrganizationService } from '@organizations/services/organization.service';

@Controller('organizations')
@UseInterceptors(ApiSuccessResponseInterceptor)
@ApiTags('Organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @JwtAuth()
  @ApiSuccessResponseDocs({
    status: 201,
    model: Organization,
    description: 'Create a new organization',
  })
  @ApiErrorResponsesDocs({
    exception: UniqueConstraintException,
    message: 'Slug already in use',
  })
  create(@Body() dto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationService.create(dto);
  }
}

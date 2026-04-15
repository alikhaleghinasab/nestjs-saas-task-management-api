import { JwtAuth } from '@auth/decorators/auth.decorator';
import { ApiErrorResponsesDocs } from '@common/decorators/api-error-response-docs';
import { ApiSuccessResponseDocs } from '@common/decorators/api-success-response-docs.decorator';
import { UniqueConstraintException } from '@common/exceptions/unique-constraint.exception';
import { ApiSuccessResponseInterceptor } from '@common/interceptors/api-success-response.interceptor';
import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOrganizationDto } from '@organizations/dto/create-organization.dto';
import { UpdateOrganizationDto } from '@organizations/dto/update-organization.dto';
import { Organization } from '@organizations/entities/organization.entity';
import { OrganizationService } from '@organizations/services/organization.service';

@Controller('organizations')
@UseInterceptors(ApiSuccessResponseInterceptor)
@ApiTags('Organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @JwtAuth()
  @ApiOperation({ summary: 'Create organization' })
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

  @Put(':id')
  @HttpCode(200)
  @JwtAuth()
  @ApiOperation({ summary: 'Update organization' })
  @ApiSuccessResponseDocs({ description: 'Organization updated' })
  @ApiErrorResponsesDocs({
    exception: UniqueConstraintException,
    message: 'Slug already in use',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizationDto,
  ): Promise<void> {
    await this.organizationService.update(id, dto);
  }
}

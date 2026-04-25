import { ApiSuccessResponseDocs } from '@common/decorators/api-success-response-docs.decorator';
import { UuidParam } from '@common/decorators/uuid-param.decorator';
import { ApiSuccessResponseInterceptor } from '@common/interceptors/api-success-response.interceptor';
import { UpdateUserRoleDto } from '@memberships/dto/update-user-role.dto';
import { Roles } from '@memberships/enums/roles.enum';
import { MembershipService } from '@memberships/services/membership.service';
import {
  Body,
  Controller,
  HttpCode,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganizationId } from '@organizations/decorators/organization-id.decorator';
import { OrganizationProtected } from '@organizations/decorators/organization-roles.decorator';

@Controller('memberships')
@UseInterceptors(ApiSuccessResponseInterceptor)
@ApiBearerAuth()
@ApiTags('Membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Patch(':userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a user role within the organization' })
  @ApiSuccessResponseDocs({ description: 'Role updated successfully' })
  @OrganizationProtected(Roles.Owner)
  async updateUserRole(
    @UuidParam('userId') userId: string,
    @OrganizationId() organizationId: string,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<void> {
    await this.membershipService.updateRole({
      organizationId,
      userId,
      role: dto.role,
    });
  }
}

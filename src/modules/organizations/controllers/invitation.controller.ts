import { JwtAuth } from '@auth/decorators/auth.decorator';
import { ApiGetOne } from '@common/decorators/api-crud.decorator';
import { ApiSuccessResponseDocs } from '@common/decorators/api-success-response-docs.decorator';
import { UuidParam } from '@common/decorators/uuid-param.decorator';
import { ApiSuccessResponseInterceptor } from '@common/interceptors/api-success-response.interceptor';
import { Roles } from '@memberships/enums/roles.enum';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganizationId } from '@organizations/decorators/organization-id.decorator';
import { InvitationPreviewDto } from '@organizations/dto/invitation-perview.dto';
import { InviteUserDto } from '@organizations/dto/invite-user.dto';
import { Invitation } from '@organizations/entities/invitation.entity';
import { InvitationService } from '@organizations/services/invitation.service';
import { OrganizationProtected } from '@users/decorators/organization-roles.decorator';

const resourceName = 'Invitation';

@Controller('invitations')
@UseInterceptors(ApiSuccessResponseInterceptor)
@ApiTags(resourceName)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  @ApiOperation({ summary: `Invite a user to join an organization` })
  @ApiSuccessResponseDocs({
    status: 201,
    model: Invitation,
    description: 'Invitation created and sent to the user',
  })
  @JwtAuth()
  @OrganizationProtected(Roles.Owner, Roles.Admin)
  async inviteUser(
    @Body() dto: InviteUserDto,
    @OrganizationId() organizationId: string,
  ): Promise<Invitation> {
    return this.invitationService.inviteUser(dto, organizationId);
  }

  @ApiGetOne({
    resourceName,
    entity: InvitationPreviewDto,
    paramName: 'invitationToken',
  })
  async findOne(
    @UuidParam('invitationToken') invitationToken: string,
  ): Promise<InvitationPreviewDto> {
    return this.invitationService.findOne(invitationToken);
  }
}

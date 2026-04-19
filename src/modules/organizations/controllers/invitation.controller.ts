import { JwtAuth } from '@auth/decorators/auth.decorator';
import { ApiErrorResponsesDocs } from '@common/decorators/api-error-response-docs.decorator';
import { ApiSuccessResponseDocs } from '@common/decorators/api-success-response-docs.decorator';
import { ErrorMessage } from '@common/errors/error-messages';
import { UniqueConstraintException } from '@common/exceptions/unique-constraint.exception';
import { ApiSuccessResponseInterceptor } from '@common/interceptors/api-success-response.interceptor';
import { Roles } from '@memberships/enums/roles.enum';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganizationId } from '@organizations/decorators/organization-id.decorator';
import { InviteUserDto } from '@organizations/dto/invite-user.dto';
import { Invitation } from '@organizations/entities/invitation.entity';
import { InvitationService } from '@organizations/services/invitation.service';
import { OrganizationProtected } from '@users/decorators/organization-roles.decorator';

const resourceName = 'Invitations';

@Controller('invitations')
@UseInterceptors(ApiSuccessResponseInterceptor)
@ApiTags(resourceName)
@JwtAuth()
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  @ApiOperation({ summary: `Invite a user to join an organization` })
  @ApiSuccessResponseDocs({
    status: 201,
    model: Invitation,
    description: 'Invitation created and sent to the user',
  })
  @OrganizationProtected(Roles.Owner, Roles.Admin)
  async inviteUser(
    @Body() dto: InviteUserDto,
    @OrganizationId() organizationId: string,
  ): Promise<Invitation> {
    return this.invitationService.inviteUser(dto, organizationId);
  }
}

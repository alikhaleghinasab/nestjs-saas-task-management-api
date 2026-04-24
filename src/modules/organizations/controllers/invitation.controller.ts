import { Public } from '@auth/decorators/public.decorator';
import { ApiGetOne } from '@common/decorators/api-crud.decorator';
import { ApiErrorResponsesDocs } from '@common/decorators/api-error-response-docs.decorator';
import { ApiSuccessResponseDocs } from '@common/decorators/api-success-response-docs.decorator';
import { UuidParam } from '@common/decorators/uuid-param.decorator';
import { UniqueConstraintException } from '@common/exceptions/unique-constraint.exception';
import { ApiSuccessResponseInterceptor } from '@common/interceptors/api-success-response.interceptor';
import { MEMBERSHIP_ERRORS } from '@memberships/constants/errors.constant';
import { Roles } from '@memberships/enums/roles.enum';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';
import { OrganizationId } from '@organizations/decorators/organization-id.decorator';
import { AcceptInvitationDto } from '@organizations/dto/accept-invitation.dto';
import { InvitationPreviewDto } from '@organizations/dto/invitation-perview.dto';
import { InviteUserDto } from '@organizations/dto/invite-user.dto';
import { Invitation } from '@organizations/entities/invitation.entity';
import { InvitationService } from '@organizations/services/invitation.service';
import {
  OrganizationProtected,
  TenantHeader,
} from '@users/decorators/organization-roles.decorator';
import { CurrentUser } from '@users/decorators/user.decorator';
import { User } from '@users/entities/user.entity';

const resourceName = 'Invitation';

@Controller('invitations')
@UseInterceptors(ApiSuccessResponseInterceptor)
@ApiTags(resourceName)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: `Invite a user to join an organization` })
  @ApiSuccessResponseDocs({
    status: 201,
    model: Invitation,
    description: 'Invitation created and sent to the user',
  })
  @TenantHeader()
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
    paramName: 'token',
  })
  @Public()
  async findOne(
    @UuidParam('token') token: string,
  ): Promise<InvitationPreviewDto> {
    return this.invitationService.findOne(token);
  }

  @Post(':token/accept')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept an organization invitation' })
  @ApiSuccessResponseDocs({
    description: 'Invitation successfully accepted and membership created',
    model: AcceptInvitationDto,
  })
  @ApiErrorResponsesDocs(
    {
      exception: ForbiddenException,
      message: ORGANIZATION_ERRORS.INVITATION_MISMATCH,
    },
    {
      exception: BadRequestException,
      message: ORGANIZATION_ERRORS.INVITATION_NOT_VALID,
    },
    {
      exception: UniqueConstraintException,
      message: MEMBERSHIP_ERRORS.MEMBERSHIP_ALREADY_EXISTS,
    },
  )
  async acceptInvite(
    @UuidParam('token') token: string,
    @CurrentUser() user: User,
  ): Promise<AcceptInvitationDto> {
    return this.invitationService.acceptInvitation(token, {
      id: user.id,
      email: user.email,
    });
  }
}

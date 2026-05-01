import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InvitationRepository } from '@organizations/repositories/invitation.repository';
import { InviteUserDto } from '@organizations/dto/invite-user.dto';
import { Invitation } from '@organizations/entities/invitation.entity';
import { InvitationPreviewDto } from '@organizations/dto/invitation-perview.dto';
import { User } from '@users/entities/user.entity';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';
import { uuidv7 } from 'uuidv7';
import { InvitationStatus } from '@organizations/enums/invitation-status.enum';
import { AcceptInvitationDto } from '@organizations/dto/accept-invitation.dto';
import { Transactional } from 'typeorm-transactional';
import { OrganizationPublisher } from '@organizations/messaging/pulishers/organization.publisher';
import { MembershipService } from '@memberships/services/membership.service';

@Injectable()
export class InvitationService {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly organizationPublisher: OrganizationPublisher,
    private readonly membershipService: MembershipService,
  ) {}

  async inviteUser(
    dto: InviteUserDto,
    organizationId: string,
  ): Promise<Invitation> {
    const token = uuidv7();
    const invitation = await this.invitationRepository.create({
      ...dto,
      invitationToken: token,
      organizationId,
    });

    await this.organizationPublisher.userInvited({
      email: invitation.email,
      invitationToken: invitation.invitationToken,
    });

    return invitation;
  }

  async findOne(token: string): Promise<InvitationPreviewDto> {
    const invitation = await this.invitationRepository.findByInvitationToken(
      token,
      ['organization'],
    );

    return {
      email: invitation.email,
      role: invitation.role,
      organizationName: invitation.organization.name,
      createdAt: invitation.createdAt,
    };
  }

  @Transactional()
  async acceptInvitation(
    token: string,
    user: Pick<User, 'id' | 'email'>,
  ): Promise<AcceptInvitationDto> {
    const invitation = await this.getValidInvitation(token);
    this.ensureInvitationMatchesUser(invitation, user);

    const { role, organizationId } = invitation;
    await this.membershipService.create({
      organizationId,
      userId: user.id,
      role,
    });
    await this.invitationRepository.markAsAccepted(invitation.id);
    return { organizationId, role };
  }

  private async getValidInvitation(token: string): Promise<Invitation> {
    const invitation =
      await this.invitationRepository.findByInvitationToken(token);

    if (!invitation || invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException(ORGANIZATION_ERRORS.INVITATION_NOT_VALID);
    }

    return invitation;
  }

  private ensureInvitationMatchesUser(
    invitation: Invitation,
    user: Pick<User, 'id' | 'email'>,
  ) {
    if (invitation.email !== user.email) {
      throw new ForbiddenException(ORGANIZATION_ERRORS.INVITATION_MISMATCH);
    }
  }
}

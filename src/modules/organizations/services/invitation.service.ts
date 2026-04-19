import { Injectable } from '@nestjs/common';
import { InvitationRepository } from '@organizations/repositories/invitation.repository';
import { InviteUserDto } from '@organizations/dto/invite-user.dto';
import { randomUUID } from 'crypto';
import { Invitation } from '@organizations/entities/invitation.entity';
import { EmailService } from '@email/services/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InvitationService {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async inviteUser(
    dto: InviteUserDto,
    organizationId: string,
  ): Promise<Invitation> {
    const invitationToken = randomUUID();
    const invitation = await this.invitationRepository.create({
      ...dto,
      invitationToken,
      organizationId,
    });

    const baseUrl = this.configService.get<string>('app.url');
    const url = `${baseUrl}/invitation?token=${invitationToken}`;
    this.emailService.send(invitation.email, {
      subject: 'Invitation',
      content: `You have been invited. Accept here: ${url}`,
    });

    return invitation;
  }
}

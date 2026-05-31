import { EmailService } from '@email/services/email.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserInvitedEvent } from '../events/user-invited.event';

@Injectable()
export class UserInvitedHandler {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async handle(payload: UserInvitedEvent) {
    const { email, invitationToken } = payload;
    const baseUrl = this.configService.get<string>('app.url');
    const url = `${baseUrl}/invitation?token=${invitationToken}`;
    await this.emailService.send(email, {
      subject: 'Invitation',
      content: `You have been invited. Accept here: ${url}`,
    });
  }
}

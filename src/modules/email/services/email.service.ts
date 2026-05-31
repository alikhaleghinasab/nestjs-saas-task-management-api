import { Injectable, Logger } from '@nestjs/common';
import { EmailOptions, SentEmail } from './email.types';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async send(to: string, options: EmailOptions): Promise<SentEmail> {
    const email: SentEmail = {
      to,
      subject: options.subject,
      content: options.content,
      sentAt: new Date(),
      status: 'sent',
    };

    await this.logEmail(email);

    return email;
  }

  private async logEmail(email: SentEmail): Promise<void> {
    this.logger.log(`
📧 FAKE EMAIL SENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: ${email.to}
Subject: ${email.subject}
Content: ${email.content.substring(0, 200)}${email.content.length > 200 ? '...' : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { EmailOptions, SentEmail } from './email.types';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  send(to: string, options: EmailOptions): SentEmail {
    const email: SentEmail = {
      to,
      subject: options.subject,
      content: options.content,
      sentAt: new Date(),
      status: 'sent',
    };

    this.logEmail(email);

    return email;
  }

  private logEmail(email: SentEmail): void {
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

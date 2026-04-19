export interface EmailOptions {
  subject: string;
  content: string;
}

export interface SentEmail {
  to: string;
  subject: string;
  content: string;
  sentAt: Date;
  status: 'sent' | 'failed';
}

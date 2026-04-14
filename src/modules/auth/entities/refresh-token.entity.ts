import { BaseIdEntity } from '@common/database/entities/base-id.entity';
import { Entity, Column, Index } from 'typeorm';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken extends BaseIdEntity {
  @Index('idx_refresh_tokens_user_id', { unique: true })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Index('idx_refresh_tokens_token_hash', { unique: true })
  @Column({ name: 'token_hash', unique: true })
  tokenHash: string;

  @Column({ type: 'uuid' })
  jti: string;

  @Column({ name: 'expires_at', type: 'timestamp with time zone' })
  expiresAt: Date;
}

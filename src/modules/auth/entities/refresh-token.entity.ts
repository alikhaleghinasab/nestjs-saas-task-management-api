import { BaseIdEntity } from '@common/database/entities/base-id.entity';
import { Entity, Column, Index } from 'typeorm';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken extends BaseIdEntity {
  @Index('idx_refresh_tokens_user_id', { unique: true })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'token_hash' })
  tokenHash: string;

  @Index('idx_refresh_tokens_jti', { unique: true })
  @Column({ type: 'uuid' })
  jti: string;

  @Column({ name: 'expires_at', type: 'timestamp with time zone' })
  expiresAt: Date;
}

import { BaseEntity } from '@common/database/entities/base.entity';
import { InvitationStatus } from '@organizations/enums/invitation-status.enum';
import { Entity, Column, Index } from 'typeorm';

@Entity('invitations')
export class Invitation extends BaseEntity {
  @Column()
  email: string;

  @Column({ type: 'uuid', name: 'organization_id' })
  organizationId: string;

  @Column()
  role: string;

  @Index('idx_invitations_invitation_token', { unique: true })
  @Column({ name: 'invitation_token' })
  invitationToken: string;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;
}

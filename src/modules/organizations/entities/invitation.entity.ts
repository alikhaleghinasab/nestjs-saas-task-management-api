import { BaseEntity } from '@common/database/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus } from '@organizations/enums/invitation-status.enum';
import { Entity, Column, Index } from 'typeorm';

@Entity('invitations')
export class Invitation extends BaseEntity {
  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column({ type: 'uuid', name: 'organization_id' })
  organizationId: string;

  @ApiProperty()
  @Column()
  role: string;

  @ApiProperty()
  @Index('idx_invitations_invitation_token', { unique: true })
  @Column({ name: 'invitation_token' })
  invitationToken: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;
}

import { BaseEntity } from '@common/database/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, Index, DeleteDateColumn } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty()
  @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: true })
  firstName: string | null;

  @ApiProperty()
  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  lastName: string | null;

  @ApiProperty()
  @Index('idx_users_email', { unique: true })
  @Column({
    name: 'email',
    type: 'varchar',
    length: 150,
    nullable: false,
    transformer: {
      to: (value) => value?.toLowerCase(),
      from: (value) => value,
    },
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  password: string;

  @ApiProperty()
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ default: null })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}

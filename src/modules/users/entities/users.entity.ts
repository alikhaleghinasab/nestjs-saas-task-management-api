import { BaseEntity } from '@common/database/entities/base.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';

@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: true })
  firstName: string | null;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  lastName: string | null;

  @Index('IDX_USERS_EMAIL', { unique: true })
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

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}

import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseIdEntity } from './base-id.entity';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity extends BaseIdEntity {
  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

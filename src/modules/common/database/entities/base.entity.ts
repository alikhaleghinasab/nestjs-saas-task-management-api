import { PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';

export abstract class BaseEntity {
  @PrimaryColumn('uuid', {
    transformer: {
      to: (value) => value ?? uuidv7(),
      from: (value) => value,
    },
  })
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

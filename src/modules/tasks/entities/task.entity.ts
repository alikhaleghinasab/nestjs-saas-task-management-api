import { Entity, Column, Index } from 'typeorm';
import { TaskPriority, TaskStatus } from '../enums/task.enum';
import { BaseEntity } from '@common/database/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tasks')
export class Task extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 125 })
  title: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty()
  @Index()
  @Column({
    type: 'enum',
    enum: TaskStatus,
    enumName: 'task_status',
  })
  status: TaskStatus;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: TaskPriority,
    enumName: 'task_priority',
    nullable: true,
  })
  priority?: TaskPriority;

  @ApiProperty()
  @Column({ name: 'due_date', type: 'timestamptz', nullable: true })
  dueDate?: Date;

  @ApiProperty()
  @Index()
  @Column({ name: 'assignee_id', type: 'uuid', nullable: true })
  assigneeId?: string;

  @ApiProperty()
  @Index()
  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @ApiProperty()
  @Index()
  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @ApiProperty()
  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string;
}

import { Entity, Column, Index } from 'typeorm';
import { TaskPriority, TaskStatus } from '../enums/task.enum';
import { BaseEntity } from '@common/database/entities/base.entity';

@Entity('task')
export class Task extends BaseEntity {
  @Column({ type: 'varchar', length: 125 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Index()
  @Column({
    type: 'enum',
    enum: TaskStatus,
    enumName: 'task_status',
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    enumName: 'task_priority',
    nullable: true,
  })
  priority?: TaskPriority;

  @Column({ name: 'due_date', type: 'timestamptz', nullable: true })
  dueDate?: Date;

  @Index()
  @Column({ name: 'assignee_id', type: 'uuid', nullable: true })
  assigneeId?: string;

  @Index()
  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Index()
  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string;
}

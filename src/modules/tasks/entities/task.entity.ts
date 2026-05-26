import { Entity, Column, Index, DeleteDateColumn } from 'typeorm';
import { TaskPriority, TaskStatus } from '../enums/task.enum';
import { ApiProperty } from '@nestjs/swagger';
import { TenantBaseEntity } from '@organizations/entities/tenant-base.entity';

@Index('idx_tasks_org_project', ['organizationId', 'projectId'], {
  where: 'deleted_at IS NULL',
})
@Index('idx_tasks_org_assignee', ['organizationId', 'assigneeId'], {
  where: 'deleted_at IS NULL',
})
@Index('idx_tasks_org_title', ['organizationId', 'title'], {
  unique: true,
  where: 'deleted_at IS NULL',
})
@Entity('tasks')
export class Task extends TenantBaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 125 })
  title: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty()
  @Index({
    where: 'deleted_at IS NULL',
  })
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
  @Column({ name: 'assignee_id', type: 'uuid', nullable: true })
  assigneeId?: string;

  @ApiProperty()
  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @ApiProperty()
  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string;

  @ApiProperty({ default: null })
  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}

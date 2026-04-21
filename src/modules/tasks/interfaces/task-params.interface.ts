import { TaskPriority, TaskStatus } from '../enums/task.enum';

export interface CreateTaskParams {
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  organizationId: string;
  projectId: string;
  assigneeId?: string;
  createdBy: string;
}

export type UpdateTaskParams = Partial<CreateTaskParams>;

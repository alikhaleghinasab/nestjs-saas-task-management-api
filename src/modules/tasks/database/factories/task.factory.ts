import { faker } from '@faker-js/faker';
import { DataSource, DeepPartial } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { TaskStatus } from '@tasks/enums/task.enum';
import { createFactory } from '@common/database/factories/base.factory';

const taskDefaultProps = (): DeepPartial<Task> => ({
  title: faker.lorem.sentence(5),
  description: faker.lorem.paragraph(),
  status: faker.helpers.arrayElement([
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ]),
});

export const TaskFactory = createFactory(Task, taskDefaultProps);

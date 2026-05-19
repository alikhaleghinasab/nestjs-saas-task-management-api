import { faker } from '@faker-js/faker';
import { DeepPartial } from 'typeorm';
import { createFactory } from '@common/database/factories/base.factory';
import { Project } from '@projects/entities/project.entity';

const projectDefaultProps = (): DeepPartial<Project> => ({
  name: faker.commerce.productName(),
  description: faker.lorem.paragraph(),
});

export const ProjectFactory = createFactory(Project, projectDefaultProps);

import { faker } from '@faker-js/faker';
import { Organization } from '../../entities/organization.entity';
import { createFactory } from '@common/database/factories/base.factory';
import { DeepPartial } from 'typeorm';

const organizationDefaultProps = (): DeepPartial<Organization> => ({
  name: faker.company.name(),
  slug: faker.helpers.slugify(faker.lorem.words(3).toLowerCase()),
});

export const OrganizationFactory = createFactory(
  Organization,
  organizationDefaultProps,
);

import { UniqueConstraintException } from '@common/exceptions/unique-constraint.exception';
import { isUniqueConstraintError } from '@common/utils/database/is-unique-constraint-error.util';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '@organizations/entities/organization.entity';
import {
  CreateOrganizationParams,
  UpdateOrganizationParams,
} from '@organizations/interfaces/organization-params.interface.ts';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationRepository {
  constructor(
    @InjectRepository(Organization)
    private readonly repo: Repository<Organization>,
  ) {}

  async findOrganizationById(id: string): Promise<Organization> {
    return this.repo.findOneBy({ id });
  }

  async createOrganization(
    data: CreateOrganizationParams,
  ): Promise<Organization> {
    const organization = this.repo.create(data);
    try {
      return await this.repo.save(organization);
    } catch (e: any) {
      if (isUniqueConstraintError(e)) {
        throw new UniqueConstraintException('Slug already in use');
      }
    }
  }

  async updateOrganization(
    id: string,
    data: UpdateOrganizationParams,
  ): Promise<boolean> {
    const organization = this.repo.create(data);
    try {
      return (await this.repo.update({ id }, organization)).affected > 0;
    } catch (err) {
      if (isUniqueConstraintError(err)) {
        throw new UniqueConstraintException('Slug already in use');
      }
      throw err;
    }
  }

  async deleteOrganization(id: string): Promise<boolean> {
    return (await this.repo.delete({ id })).affected > 0;
  }
}

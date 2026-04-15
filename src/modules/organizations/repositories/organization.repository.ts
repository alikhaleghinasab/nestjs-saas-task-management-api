import { UniqueConstraintException } from '@common/exceptions/unique-constraint.exception';
import { isUniqueConstraintError } from '@common/utils/database/is-unique-constraint-error.util';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '@organizations/entities/organization.entity';
import { CreateOrganizationParams } from '@organizations/interfaces/create-organization.interface';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationRepository {
  constructor(
    @InjectRepository(Organization)
    private readonly repo: Repository<Organization>,
  ) {}

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
}

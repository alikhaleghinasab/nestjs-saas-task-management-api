import { PaginationDto } from '@common/dto/pagination.dto';
import { UniqueConstraintException } from '@common/exceptions/unique-constraint.exception';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { isUniqueConstraintError } from '@common/utils/database/is-unique-constraint-error.util';
import { paginate } from '@common/utils/database/paginate.util';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';
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

  async findMany(dto: PaginationDto): Promise<PaginatedResponse<Organization>> {
    return paginate(this.repo, dto);
  }

  async findById(id: string): Promise<Organization> {
    return this.repo.findOneBy({ id });
  }

  async create(data: CreateOrganizationParams): Promise<Organization> {
    const organization = this.repo.create(data);
    try {
      return await this.repo.save(organization);
    } catch (e: any) {
      if (isUniqueConstraintError(e)) {
        throw new UniqueConstraintException(ORGANIZATION_ERRORS.SLUG_EXISTS);
      }
    }
  }

  async update(id: string, data: UpdateOrganizationParams): Promise<boolean> {
    const organization = this.repo.create(data);
    try {
      return (await this.repo.update({ id }, organization)).affected > 0;
    } catch (err) {
      if (isUniqueConstraintError(err)) {
        throw new UniqueConstraintException(ORGANIZATION_ERRORS.SLUG_EXISTS);
      }
      throw err;
    }
  }

  async delete(id: string): Promise<boolean> {
    return (await this.repo.delete({ id })).affected > 0;
  }
}

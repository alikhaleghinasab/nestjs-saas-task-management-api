import { CatchUniqueConstraint } from '@common/decorators/catch-unique-constraint.decorator';
import { EnsureAffected } from '@common/decorators/ensure-affected.decorator';
import { EnsureFound } from '@common/decorators/ensure-found.decorator';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { wasAffected } from '@common/utils/database/ensure-affected.util';
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

  @EnsureFound()
  async findById(id: string): Promise<Organization> {
    return this.repo.findOneBy({ id });
  }

  @CatchUniqueConstraint(ORGANIZATION_ERRORS.SLUG_EXISTS)
  async create(data: CreateOrganizationParams): Promise<Organization> {
    const organization = this.repo.create(data);
    return await this.repo.save(organization);
  }

  @CatchUniqueConstraint(ORGANIZATION_ERRORS.SLUG_EXISTS)
  @EnsureAffected()
  async update(id: string, data: UpdateOrganizationParams): Promise<boolean> {
    const organization = this.repo.create(data);
    return await wasAffected(this.repo.update({ id }, organization));
  }

  @EnsureAffected()
  async delete(id: string): Promise<boolean> {
    return await wasAffected(this.repo.delete({ id }));
  }
}

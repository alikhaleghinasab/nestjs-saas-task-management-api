import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from '../entities/membership.entity';
import {
  CreateMembershipParams,
  UpdateMembershipRoleParams,
} from '../interfaces/membership-params.interface';
import { MEMBERSHIP_ERRORS } from '../constants/errors.constant';
import { CatchUniqueConstraint } from '@common/decorators/catch-unique-constraint.decorator';
import { wasAffected } from '@common/utils/database/ensure-affected.util';
import { Roles } from '@memberships/enums/roles.enum';
import { EnsureAffected } from '@common/decorators/ensure-affected.decorator';
import { TenantBaseRepository } from '@organizations/repositories/tenant-base.repository';
import { withOrg } from '@organizations/utils/with-org.util';

@Injectable()
export class MembershipRepository extends TenantBaseRepository<Membership> {
  constructor(
    @InjectRepository(Membership)
    protected readonly repo: Repository<Membership>,
  ) {
    super();
  }

  @CatchUniqueConstraint(MEMBERSHIP_ERRORS.MEMBERSHIP_ALREADY_EXISTS)
  async create(data: CreateMembershipParams): Promise<Membership> {
    const membership = this.repo.create(data);
    return this.repo.save(membership);
  }

  @EnsureAffected()
  async updateRole(data: UpdateMembershipRoleParams): Promise<boolean> {
    const { userId, organizationId, role } = data;
    return wasAffected(
      this.repo.update(withOrg({ userId }, organizationId), { role }),
    );
  }

  @EnsureAffected(MEMBERSHIP_ERRORS.MEMBERSHIP_DOES_NOT_EXIST)
  async delete(userId: string, organizationId: string): Promise<boolean> {
    return wasAffected(this.repo.delete(withOrg({ userId }, organizationId)));
  }

  async getUserRoleInOrganization(
    userId: string,
    organizationId: string,
  ): Promise<Roles | null> {
    const membership = await this.repo.findOne({
      where: withOrg({ userId }, organizationId),
      select: ['role'],
    });

    return membership?.role || null;
  }
}

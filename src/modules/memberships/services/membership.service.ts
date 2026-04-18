import { Injectable } from '@nestjs/common';
import { MembershipRepository } from '../repositories/membership.repository';
import { CreateMembershipParams } from '../interfaces/create-membership.interface';
import { Membership } from '../entities/membership.entity';
import { EnsureAffected } from '@common/decorators/ensure-affected.decorator';
import { MEMBERSHIP_ERRORS } from '@memberships/constants/errors.constant';
import { Roles } from '@memberships/enums/roles.enum';
import { CacheResult } from '@cache/cache-result.decorator';
import { CacheHelper } from '@cache/cache.helper';

@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private readonly cacheHelper: CacheHelper,
  ) {}

  async create(data: CreateMembershipParams): Promise<Membership> {
    return this.membershipRepository.create(data);
  }

  @EnsureAffected(MEMBERSHIP_ERRORS.MEMBERSHIP_DOES_NOT_EXIST)
  async delete(userId: string, organizationId: string): Promise<boolean> {
    return this.membershipRepository.delete(userId, organizationId);
  }

  @CacheResult({
    key: (userId: string, organizationId: string) =>
      `membership:user-role-${userId}-${organizationId}`,
    ttl: 60 * 60,
  })
  async getUserRoleInOrganization(
    userId: string,
    organizationId: string,
  ): Promise<Roles | null> {
    return this.membershipRepository.getUserRoleInOrganization(
      userId,
      organizationId,
    );
  }
}

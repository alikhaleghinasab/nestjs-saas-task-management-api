import { Injectable } from '@nestjs/common';
import { MembershipRepository } from '../repositories/membership.repository';
import {
  CreateMembershipParams,
  UpdateMembershipRoleParams,
} from '../interfaces/membership-params.interface';
import { Membership } from '../entities/membership.entity';
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

  async updateRole(data: UpdateMembershipRoleParams): Promise<boolean> {
    return this.membershipRepository.updateRole(data);
  }

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

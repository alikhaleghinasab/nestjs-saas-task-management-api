import { Inject, Injectable } from '@nestjs/common';
import { MembershipRepository } from '../repositories/membership.repository';
import {
  CreateMembershipParams,
  UpdateMembershipRoleParams,
} from '../interfaces/membership-params.interface';
import { Membership } from '../entities/membership.entity';
import { Roles } from '@memberships/enums/roles.enum';
import { CacheHelper } from '@cache/cache.helper';
import { CACHE_PROVIDER } from '@cache/cache.constant';
import { CacheProviderInterface } from '@cache/cache-provider.interface';
import { Transactional } from 'typeorm-transactional';
import {
  getUserRoleCacheKey,
  USER_ROLE_CACHE_TTL_SECONDS,
} from '@memberships/constants/membership.constant';

@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly cacheHelper: CacheHelper,
    @Inject(CACHE_PROVIDER)
    private readonly cacheProvider: CacheProviderInterface,
  ) {}

  async create(data: CreateMembershipParams): Promise<Membership> {
    return this.membershipRepository.create(data);
  }

  @Transactional()
  async updateRole(data: UpdateMembershipRoleParams): Promise<boolean> {
    const result = await this.membershipRepository.updateRole(data);
    await this.invalidateCache(data.userId, data.organizationId);
    return result;
  }

  @Transactional()
  async delete(userId: string, organizationId: string): Promise<boolean> {
    const result = await this.membershipRepository.delete(
      userId,
      organizationId,
    );
    await this.invalidateCache(userId, organizationId);
    return result;
  }

  async getUserRoleInOrganization(
    userId: string,
    organizationId: string,
  ): Promise<Roles | null> {
    const cacheKey = getUserRoleCacheKey(userId, organizationId);
    const role = await this.cacheHelper.getOrSetString(
      cacheKey,
      () =>
        this.membershipRepository.getUserRoleInOrganization(
          userId,
          organizationId,
        ),
      USER_ROLE_CACHE_TTL_SECONDS,
    );
    return role as Roles;
  }

  private async invalidateCache(userId: string, organizationId: string) {
    const keyToInvalidate = getUserRoleCacheKey(userId, organizationId);
    await this.cacheProvider.del(keyToInvalidate);
  }
}

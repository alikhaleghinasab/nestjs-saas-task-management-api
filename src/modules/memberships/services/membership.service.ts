import { Injectable } from '@nestjs/common';
import { MembershipRepository } from '../repositories/membership.repository';
import { CreateMembershipParams } from '../interfaces/create-membership.interface';
import { Membership } from '../entities/membership.entity';
import { EnsureAffected } from '@common/decorators/ensure-affected.decorator';
import { MEMBERSHIP_ERRORS } from '@memberships/constants/errors.constant';

@Injectable()
export class MembershipService {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async create(data: CreateMembershipParams): Promise<Membership> {
    return this.membershipRepository.create(data);
  }

  @EnsureAffected(MEMBERSHIP_ERRORS.MEMBERSHIP_DOES_NOT_EXIST)
  async delete(userId: string, organizationId: string): Promise<boolean> {
    return this.membershipRepository.delete(userId, organizationId);
  }
}

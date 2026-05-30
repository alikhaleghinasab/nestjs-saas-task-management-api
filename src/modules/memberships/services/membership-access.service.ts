import { MEMBERSHIP_ERRORS } from '@memberships/constants/errors.constant';
import { MembershipRepository } from '@memberships/repositories/membership.repository';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class MembershipAccessService {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async ensureUserBelongsToOrganization(
    userId: string,
    organizationId: string,
  ): Promise<void> {
    const exists = await this.membershipRepository.existsUserInOrganization(
      userId,
      organizationId,
    );

    if (!exists) {
      throw new ForbiddenException(MEMBERSHIP_ERRORS.USER_MEMBERSHIP_MISMATCH);
    }
  }
}

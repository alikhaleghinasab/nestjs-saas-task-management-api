import { Injectable } from '@nestjs/common';
import { MembershipRepository } from '../repositories/membership.repository';
import { CreateMembershipParams } from '../interfaces/create-membership.interface';
import { Membership } from '../entities/membership.entity';

@Injectable()
export class MembershipService {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async create(data: CreateMembershipParams): Promise<Membership> {
    return this.membershipRepository.create(data);
  }
}

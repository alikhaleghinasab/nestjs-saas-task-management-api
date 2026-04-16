import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from '../entities/membership.entity';
import { CreateMembershipParams } from '../interfaces/create-membership.interface';
import { MEMBERSHIP_ERRORS } from '../constants/errors.constant';
import { CatchUniqueConstraint } from '@common/decorators/catch-unique-constraint.decorator';

@Injectable()
export class MembershipRepository {
  constructor(
    @InjectRepository(Membership) private readonly repo: Repository<Membership>,
  ) {}

  @CatchUniqueConstraint(MEMBERSHIP_ERRORS.MEMBERSHIP_EXISTS)
  async create(data: CreateMembershipParams): Promise<Membership> {
    const membership = this.repo.create(data);
    return this.repo.save(membership);
  }
}

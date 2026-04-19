import { CatchUniqueConstraint } from '@common/decorators/catch-unique-constraint.decorator';
import { EnsureFound } from '@common/decorators/ensure-found.decorator';
import { ErrorMessage } from '@common/errors/error-messages';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from '@organizations/entities/invitation.entity';
import { InvitationParams } from '@organizations/interfaces/invitation-params.interface';
import { Repository } from 'typeorm';

@Injectable()
export class InvitationRepository {
  constructor(
    @InjectRepository(Invitation)
    private readonly repo: Repository<Invitation>,
  ) {}

  async create(data: InvitationParams): Promise<Invitation> {
    const invitation = this.repo.create(data);
    return await this.repo.save(invitation);
  }

  @EnsureFound()
  async findByInvitationToken(invitationToken: string): Promise<Invitation> {
    return this.repo.findOne({
      where: { invitationToken },
      relations: ['organization'],
    });
  }
}

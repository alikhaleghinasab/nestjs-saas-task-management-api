import { CatchUniqueConstraint } from '@common/decorators/catch-unique-constraint.decorator';
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
}

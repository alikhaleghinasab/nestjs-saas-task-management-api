import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { MembershipRepository } from './repositories/membership.repository';
import { MembershipService } from './services/membership.service';
import { CreateOwnerMembershipHandler } from './handlers/create-owner-membership.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteMembershipHandler } from './handlers/delete-membership.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Membership]), CqrsModule],
  providers: [
    MembershipRepository,
    MembershipService,
    CreateOwnerMembershipHandler,
    DeleteMembershipHandler,
  ],
  exports: [MembershipService],
})
export class MembershipModule {}

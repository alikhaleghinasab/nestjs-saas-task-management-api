import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { MembershipRepository } from './repositories/membership.repository';
import { MembershipService } from './services/membership.service';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteMembershipHandler } from './handlers/delete-membership.handler';
import { CreateMembershipHandler } from './handlers/create-membership.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Membership]), CqrsModule],
  providers: [
    MembershipRepository,
    MembershipService,
    CreateMembershipHandler,
    DeleteMembershipHandler,
  ],
  exports: [MembershipService],
})
export class MembershipModule {}

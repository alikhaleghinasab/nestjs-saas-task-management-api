import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationController } from './controllers/organization.controller';
import { OrganizationService } from './services/organization.service';
import { OrganizationRepository } from './repositories/organization.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { MembershipModule } from '@memberships/membership.module';
import { OrganizationRolesGuard } from './guards/organization-roles.guard';
import { InvitationController } from './controllers/invitation.controller';
import { Invitation } from './entities/invitation.entity';
import { InvitationService } from './services/invitation.service';
import { InvitationRepository } from './repositories/invitation.repository';
import { EmailModule } from '@email/email.module';
import { AcceptInvitationHandler } from './handlers/accept-invitation.handler';
import { MessagingModule } from '@messaging/messaging.module';
import { InvitationConsumer } from './messaging/consumers/invitation.consumer';
import { UserInvitedHandler } from './messaging/handlers/user-invited.handler';
import { OrganizationPublisher } from './messaging/pulishers/organization.publisher';

@Module({
  controllers: [OrganizationController, InvitationController],
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Organization, Invitation]),
    EmailModule,
    MembershipModule,
    MessagingModule,
  ],
  providers: [
    AcceptInvitationHandler,
    OrganizationService,
    OrganizationRepository,
    OrganizationPublisher,
    InvitationService,
    InvitationRepository,
    OrganizationRolesGuard,
    InvitationConsumer,
    UserInvitedHandler,
  ],
  exports: [OrganizationRolesGuard],
})
export class OrganizationModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationController } from './controllers/organization.controller';
import { OrganizationService } from './services/organization.service';
import { OrganizationRepository } from './repositories/organization.repository';
import { MembershipModule } from '@memberships/membership.module';
import { OrganizationRolesGuard } from './guards/organization-roles.guard';
import { InvitationController } from './controllers/invitation.controller';
import { Invitation } from './entities/invitation.entity';
import { InvitationService } from './services/invitation.service';
import { InvitationRepository } from './repositories/invitation.repository';
import { EmailModule } from '@email/email.module';
import { MessagingModule } from '@messaging/messaging.module';
import { InvitationEventConsumer } from './messaging/consumers/invitation-event.consumer';
import { UserInvitedHandler } from './messaging/handlers/user-invited.handler';
import { OrganizationEventPublisher } from './messaging/pulishers/organization-event.publisher';

@Module({
  controllers: [OrganizationController, InvitationController],
  imports: [
    TypeOrmModule.forFeature([Organization, Invitation]),
    EmailModule,
    MembershipModule,
    MessagingModule,
  ],
  providers: [
    OrganizationService,
    OrganizationRepository,
    OrganizationEventPublisher,
    InvitationService,
    InvitationRepository,
    OrganizationRolesGuard,
    InvitationEventConsumer,
    UserInvitedHandler,
  ],
  exports: [OrganizationRolesGuard],
})
export class OrganizationModule {}

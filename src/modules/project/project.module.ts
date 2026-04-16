import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { AuthModule } from '@auth/auth.module';
import { OrganizationModule } from '@organizations/organization.module';
import { MembershipModule } from '@memberships/membership.module';

@Module({
  imports: [UsersModule, AuthModule, OrganizationModule, MembershipModule],
  controllers: [],
  providers: [],
})
export class ProjectModule {}

import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { AuthModule } from '@auth/auth.module';
import { OrganizationModule } from '@organizations/organization.module';
import { MembershipModule } from '@memberships/membership.module';
import { CacheModule } from '@cache/cache.module';
import { CacheDriver } from '@cache/cache-driver.enum';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    OrganizationModule,
    MembershipModule,
    CacheModule.forRoot({ driver: CacheDriver.REDIS }),
  ],
  controllers: [],
  providers: [],
})
export class ProjectModule {}

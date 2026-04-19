import { Module } from '@nestjs/common';
import { OrganizationModule } from '@organizations/organization.module';
import { MembershipModule } from '@memberships/membership.module';
import { CacheModule } from '@cache/cache.module';
import { CacheDriver } from '@cache/cache-driver.enum';

@Module({
  imports: [
    OrganizationModule,
    MembershipModule,
    CacheModule.forRoot({ driver: CacheDriver.REDIS }),
  ],
  controllers: [],
  providers: [],
})
export class ProjectModule {}

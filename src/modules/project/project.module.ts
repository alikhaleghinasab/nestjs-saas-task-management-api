import { Module } from '@nestjs/common';
import { OrganizationModule } from '@organizations/organization.module';
import { MembershipModule } from '@memberships/membership.module';
import { CacheModule } from '@cache/cache.module';
import { CacheDriver } from '@cache/cache-driver.enum';
import { ProjectsModule } from '@projects/projects.module';

@Module({
  imports: [
    OrganizationModule,
    MembershipModule,
    ProjectsModule,
    CacheModule.forRoot({ driver: CacheDriver.REDIS }),
  ],
  controllers: [],
  providers: [],
})
export class ProjectModule {}

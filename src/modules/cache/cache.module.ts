import { Module } from '@nestjs/common';
import { resolveCacheImports, resolveCacheProviders } from './cache.resolver';
import { CacheModuleOptions } from './cache.interface';
import { createDynamicModule } from '@common/utils/dynamic-module.factory';
import { CacheHelper } from './cache.helper';
import { CacheVersionService } from './cache-version.service';

const { BaseModule, MODULE_OPTIONS_TOKEN } =
  createDynamicModule<CacheModuleOptions>({
    importsFactory: resolveCacheImports,
    providersFactory: resolveCacheProviders,
  });

@Module({
  providers: [CacheHelper, CacheVersionService],
  exports: [CacheHelper, CacheVersionService],
})
export class CacheModule extends BaseModule {}

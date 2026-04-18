import { Module } from '@nestjs/common';
import { resolveCacheImports, resolveCacheProviders } from './cache.resolver';
import { CacheModuleOptions } from './cache.interface';
import { createDynamicModule } from '@common/utils/dynamic-module.factory';
import { CacheHelper } from './cache.helper';

const { BaseModule, MODULE_OPTIONS_TOKEN } =
  createDynamicModule<CacheModuleOptions>({
    importsFactory: resolveCacheImports,
    providersFactory: resolveCacheProviders,
  });

@Module({
  providers: [CacheHelper],
  exports: [CacheHelper],
})
export class CacheModule extends BaseModule {}

import { DynamicModule, Module } from '@nestjs/common';
import { CacheHelper } from './cache.helper';
import { CacheVersionService } from './cache-version.service';
import { CACHE_PROVIDER } from './cache.constant';
import { CacheDriverMapper } from './cache-driver.mapper';
import { CacheModuleOptions } from './cache.interface';

@Module({})
export class CacheModule {
  static forRoot(options: CacheModuleOptions): DynamicModule {
    const config = CacheDriverMapper[options.driver];

    if (!config) {
      throw new Error(`Unsupported cache driver: ${options.driver}`);
    }

    return {
      module: CacheModule,
      global: true,
      imports: config.module ? [config.module] : [],
      providers: [
        {
          provide: CACHE_PROVIDER,
          useClass: config.service,
        },
        CacheHelper,
        CacheVersionService,
      ],
      exports: [CACHE_PROVIDER, CacheHelper, CacheVersionService],
    };
  }
}

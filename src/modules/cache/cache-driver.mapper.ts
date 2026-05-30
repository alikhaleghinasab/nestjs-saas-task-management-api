import { RedisService } from '@rediscore/redis.service';
import { RedisModule } from '@rediscore/redis.module';
import { CacheDriver } from './cache-driver.enum';
import { InMemoryCacheProvider } from './in-memory-cache.provider';
import { CacheProviderInterface } from './cache-provider.interface';
import { Type } from '@nestjs/common';

export interface CacheDriverConfig {
  service: new (...args: any[]) => CacheProviderInterface;
  module?: Type<any>;
}

export const CacheDriverMapper: Record<CacheDriver, CacheDriverConfig> = {
  [CacheDriver.REDIS]: {
    service: RedisService,
    module: RedisModule,
  },
  [CacheDriver.IN_MEMORY]: {
    service: InMemoryCacheProvider,
  },
};

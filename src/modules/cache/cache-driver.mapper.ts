import { RedisService } from '@redis/redis.service';
import { RedisModule } from '@redis/redis.module';
import { CacheDriver } from './cache-driver.enum';
import { InMemoryCacheProvider } from './in-memory-cache.provider';

export interface CacheDriverConfig {
  service: new (...args: any[]) => any;
  module?: any;
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

import { DynamicModule, Provider } from '@nestjs/common';
import { CACHE_PROVIDER } from './cache.constant';
import { CacheDriverMapper } from './cache-driver.mapper';
import { CacheModuleOptions } from './cache.interface';

const cacheProviders = [CACHE_PROVIDER] as const;

export const resolveCacheProviders = (
  options: CacheModuleOptions,
): Provider[] => {
  const driver = options.driver;
  const config = CacheDriverMapper[driver];
  if (!config) {
    throw new Error(`Unsupported cache driver: ${driver}`);
  }

  return cacheProviders.map((provide) => ({
    provide,
    useClass: config.service,
  }));
};

export const resolveCacheImports = (
  options: CacheModuleOptions,
): DynamicModule[] => {
  const driver = options.driver;
  const config = CacheDriverMapper[driver];
  if (!config) {
    throw new Error(`Unsupported cache driver: ${driver}`);
  }

  return config.module ? [config.module] : [];
};

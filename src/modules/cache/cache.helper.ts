import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_PROVIDER } from './cache.constant';
import { CacheProviderInterface } from './cache-provider.interface';

@Injectable()
export class CacheHelper {
  private readonly logger = new Logger(CacheHelper.name);

  private readonly pending = new Map<string, Promise<unknown>>();

  constructor(
    @Inject(CACHE_PROVIDER)
    private readonly cacheProvider: CacheProviderInterface,
  ) {}

  async getOrSetString(
    key: string,
    resolve: () => Promise<string | null>,
    ttl?: number,
  ): Promise<string | null> {
    return this.getOrSetInternal(key, resolve, ttl, String, String);
  }

  async getOrSetJson<T>(
    key: string,
    resolve: () => Promise<T | null>,
    ttl?: number,
  ): Promise<T | null> {
    return this.getOrSetInternal(
      key,
      resolve,
      ttl,
      (v) => JSON.stringify(v),
      (v) => JSON.parse(v),
    );
  }

  private async getOrSetInternal<T>(
    key: string,
    resolve: () => Promise<T | null>,
    ttl: number | undefined,
    serialize: (value: T) => string,
    deserialize: (value: string) => T,
  ): Promise<T | null> {
    // Stampede Protection
    if (this.pending.has(key)) {
      return this.pending.get(key) as Promise<T | null>;
    }

    const promise = this.execute(key, resolve, ttl, serialize, deserialize);
    this.pending.set(key, promise);

    try {
      return await promise;
    } finally {
      this.pending.delete(key);
    }
  }

  private async execute<T>(
    key: string,
    resolve: () => Promise<T | null>,
    ttl: number | undefined,
    serialize: (value: T) => string,
    deserialize: (value: string) => T,
  ): Promise<T | null> {
    const cached = await this.cacheProvider.get(key);
    if (cached !== null) {
      return deserialize(cached);
    }

    const value = await resolve();

    await this.cacheProvider.set(key, serialize(value), ttl);

    return value;
  }
}

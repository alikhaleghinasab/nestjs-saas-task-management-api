import { Injectable } from '@nestjs/common';
import { CacheProviderInterface } from './cache-provider.interface';

@Injectable()
export class InMemoryCacheProvider implements CacheProviderInterface {
  private readonly cache: Map<string, string> = new Map();
  private readonly timeouts: Map<string, NodeJS.Timeout> = new Map();

  private clearTimeoutForKey(key: string): void {
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key)!);
      this.timeouts.delete(key);
    }
  }

  public async set(key: string, value: string, ttl?: number): Promise<void> {
    this.clearTimeoutForKey(key);
    this.cache.set(key, value);

    if (typeof ttl === 'number' && ttl > 0) {
      const timeoutId = setTimeout(() => {
        this.del(key);
      }, ttl * 1000);

      if (typeof timeoutId.unref === 'function') {
        timeoutId.unref();
      }

      this.timeouts.set(key, timeoutId);
    }
  }

  public async get(key: string): Promise<string | null> {
    const value = this.cache.get(key);
    return value ?? null;
  }

  public async del(key: string): Promise<number> {
    this.clearTimeoutForKey(key);
    const wasDeleted = this.cache.delete(key);
    return wasDeleted ? 1 : 0;
  }

  public async exists(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  public async expire(key: string, seconds: number): Promise<number> {
    if (!this.cache.has(key)) {
      return 0;
    }

    const value = this.cache.get(key)!;
    await this.set(key, value, seconds);
    return 1;
  }
}

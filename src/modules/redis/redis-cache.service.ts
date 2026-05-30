import { Injectable } from '@nestjs/common';
import { CacheProviderInterface } from '@cache/cache-provider.interface';
import { RedisClient } from './redis.client';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisCacheService implements CacheProviderInterface {
  constructor(private readonly redis: RedisClient) {}

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const client = this.getClient();

    if (ttl) {
      await client.setEx(key, ttl, value);
    } else {
      await client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    const value = this.getClient().get(key);
    return typeof value === 'string' ? value : null;
  }

  async del(key: string): Promise<number> {
    return this.getClient().del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.getClient().exists(key)) === 1;
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.getClient().expire(key, seconds);
  }

  async increment(key: string): Promise<number> {
    return this.getClient().incr(key);
  }

  private getClient(): RedisClientType {
    return this.redis.getClient();
  }
}

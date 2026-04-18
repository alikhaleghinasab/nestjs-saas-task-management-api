import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { CacheProviderInterface } from '@cache/cache-provider.interface';

@Injectable()
export class RedisService
  implements OnModuleInit, OnModuleDestroy, CacheProviderInterface
{
  private client: RedisClientType;

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const redisConfig = this.configService.get('redis');

    this.client = createClient({
      url: `redis://${redisConfig.host}:${redisConfig.port}`,
      password: redisConfig.password,
      database: redisConfig.db,
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {});

    await this.client.connect();
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  // Basic operations
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    const value = await this.client.get(key);
    return typeof value === 'string' ? value : null;
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  // Hash operations
  async hSet(key: string, field: string, value: string): Promise<number> {
    return await this.client.hSet(key, field, value);
  }

  async hGet(key: string, field: string): Promise<string | null> {
    const value = await this.client.hGet(key, field);
    return typeof value === 'string' ? value : null;
  }

  async hGetAll(key: string): Promise<Record<string, string>> {
    return await this.client.hGetAll(key);
  }

  // List operations
  async lPush(key: string, value: string): Promise<number> {
    return await this.client.lPush(key, value);
  }

  async rPop(key: string): Promise<string | null> {
    const value = await this.client.rPop(key);
    return typeof value === 'string' ? value : null;
  }

  // Set operations
  async sAdd(key: string, value: string): Promise<number> {
    return await this.client.sAdd(key, value);
  }

  async sMembers(key: string): Promise<string[]> {
    return await this.client.sMembers(key);
  }

  // Utility methods
  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return await this.client.expire(key, seconds);
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.client.keys(pattern);
  }

  // Pipeline operations
  async multi(): Promise<any> {
    return this.client.multi();
  }

  // Get raw client for advanced operations
  getClient(): RedisClientType {
    return this.client;
  }
}

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisClient.name);

  private client: RedisClientType;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const cfg = this.config.get('redis');

    this.client = createClient({
      url: `redis://${cfg.host}:${cfg.port}`,
      password: cfg.password,
      database: cfg.db,
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis error:', err);
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): RedisClientType {
    return this.client;
  }
}

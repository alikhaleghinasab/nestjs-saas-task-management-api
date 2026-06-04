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

  private readonly MAX_RETRIES = 0;
  private readonly BASE_DELAY = 5000;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const cfg = this.config.get('redis');

    this.client = createClient({
      url: `redis://${cfg.host}:${cfg.port}`,
      password: cfg.password,
      database: cfg.db,
      socket: {
        reconnectStrategy: (retries) => {
          if (this.shouldStopReconnect(retries)) {
            return false;
          }

          const delay = this.calculateBackoff(retries);

          this.logger.warn(`Redis reconnect attempt ${retries} in ${delay}ms`);

          return delay;
        },
      },
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis error', err.message);
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connected');
    });

    this.client.connect().catch((err) => {
      this.logger.error('Initial Redis connection failed', err.message);
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): RedisClientType {
    return this.client;
  }

  private calculateBackoff(attempt: number): number {
    const base = this.BASE_DELAY;
    const exponential = base * 2 ** (attempt - 1);
    const jitter = exponential * (Math.random() * 0.2 - 0.1);
    const max = 60000;

    return Math.min(exponential + jitter, max);
  }

  private shouldStopReconnect(retries: number): boolean {
    const maxRetries = this.MAX_RETRIES;

    if (maxRetries > 0 && retries > maxRetries) {
      this.logger.error(
        `Redis failed after ${retries - 1} retries. Stopping reconnect.`,
      );
      return true;
    }

    return false;
  }

  public isConnected(): boolean {
    return this.client?.isReady ?? false;
  }

  async ping(): Promise<boolean> {
    try {
      const res = await this.client.ping();
      return res === 'PONG';
    } catch {
      return false;
    }
  }
}

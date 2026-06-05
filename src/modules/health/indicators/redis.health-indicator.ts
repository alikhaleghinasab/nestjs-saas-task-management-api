import { Injectable, Logger } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { RedisClient } from '@rediscore/redis.client';
import { withTimeout } from '@common/utils/with-timeout.util';
import { HEALTH_TIMEOUTS } from '../health.constants';

@Injectable()
export class RedisHealthIndicator {
  private readonly logger = new Logger(RedisHealthIndicator.name);

  constructor(
    private readonly redis: RedisClient,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);

    try {
      const isHealthy =
        this.redis.isConnected() &&
        (await withTimeout(this.redis.ping(), HEALTH_TIMEOUTS.REDIS));

      if (isHealthy) return indicator.up();
      else return indicator.down();
    } catch (error) {
      this.logger.error('Redis health check failed', error);
      return indicator.down();
    }
  }
}

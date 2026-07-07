import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQConnectionManager } from '@rabbitmq/connection/rabbitmq-connection.manager';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { withTimeout } from '@common/utils/with-timeout.util';
import { HEALTH_TIMEOUTS, RABBITMQ_HEALTH_QUEUE } from '../health.constants';

@Injectable()
export class RabbitMQHealthIndicator {
  private readonly logger = new Logger(RabbitMQHealthIndicator.name);

  constructor(
    private readonly rabbitmqConnection: RabbitMQConnectionManager,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);

    try {
      const channel = this.rabbitmqConnection.getChannel();
      const isHealthy =
        this.rabbitmqConnection.isConnected() &&
        !!channel &&
        !!(await withTimeout(
          channel.checkQueue(RABBITMQ_HEALTH_QUEUE),
          HEALTH_TIMEOUTS.RABBITMQ,
        ));

      if (isHealthy) return indicator.up();
      else return indicator.down();
    } catch (error) {
      this.logger.error('RabbitMQ health check failed:', error);
      return indicator.down();
    }
  }
}

import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '@auth/decorators/public.decorator';
import { HEALTH_TIMEOUTS, SERVICE_NAME } from './health.constants';
import { RedisHealthIndicator } from './indicators/redis.health-indicator';
import { RabbitMQHealthIndicator } from './indicators/rabbitmq.health-indicator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: TypeOrmHealthIndicator,
    private readonly redis: RedisHealthIndicator,
    private readonly rabbitmq: RabbitMQHealthIndicator,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      () =>
        this.database.pingCheck(SERVICE_NAME.DATABASE, {
          timeout: HEALTH_TIMEOUTS.DATABASE,
        }),
      () => this.redis.isHealthy(SERVICE_NAME.REDIS),
      () => this.rabbitmq.isHealthy(SERVICE_NAME.RABBITMQ),
    ]);
  }
}

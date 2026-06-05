import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RabbitMQModule } from '@rabbitmq/rabbitmq.module';
import { RedisModule } from '@rediscore/redis.module';
import { HealthController } from './health.controller';
import { RedisHealthIndicator } from './indicators/redis.health-indicator';
import { RabbitMQHealthIndicator } from './indicators/rabbitmq.health-indicator';

@Module({
  imports: [TerminusModule, RabbitMQModule, RedisModule],
  providers: [RedisHealthIndicator, RabbitMQHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}

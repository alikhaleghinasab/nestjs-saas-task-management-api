import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import redisConfig from './redis.config';
import { RedisClient } from './redis.client';
import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [RedisClient, RedisCacheService],
  exports: [RedisCacheService, RedisClient],
})
export class RedisModule {}

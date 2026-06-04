import { ConfigType, registerAs } from '@nestjs/config';

const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT ?? '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB ?? '0'),
  retriesCount: Number(process.env.REDIS_RETRIES_COUNT ?? '0'),
}));

export default redisConfig;
export type RedisConfigType = ConfigType<typeof redisConfig>;

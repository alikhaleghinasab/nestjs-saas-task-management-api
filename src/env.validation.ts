import * as Joi from 'joi';
import { typeormConfigValidationSchema } from '@database/typeorm-config.validation';
import { authConfigValidationSchema } from '@auth/configs/auth-config.validation';
import { redisConfigValidationSchema } from '@rediscore/redis-config.validation';
import { rabbitmqConfigValidationSchema } from '@rabbitmq/config/rabbitmq-config.validation';

export const configValidationSchema = Joi.object({
  APP_PORT: Joi.number(),
  APP_URL: Joi.string().uri().required(),
  API_URL: Joi.string().uri().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  COOKIE_SECRET: Joi.string().required(),
  ...typeormConfigValidationSchema,
  ...authConfigValidationSchema,
  ...redisConfigValidationSchema,
  ...rabbitmqConfigValidationSchema,
});

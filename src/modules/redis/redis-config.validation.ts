import * as Joi from 'joi';

export const redisConfigValidationSchema = {
  REDIS_HOST: Joi.string().hostname().default('localhost').required(),

  REDIS_PORT: Joi.number().port().default(6379).required(),

  REDIS_PASSWORD: Joi.string().allow('', null).optional(),

  REDIS_DB: Joi.number().integer().min(0).max(15).default(0),
};

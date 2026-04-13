import * as Joi from 'joi';
import { typeormConfigValidationSchema } from '@database/typeorm-config.validation';
import { authConfigValidationSchema } from '@auth/configs/auth-config.validation';

export const configValidationSchema = Joi.object({
  APP_PORT: Joi.number(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  COOKIE_SECRET: Joi.string().required(),
  ...typeormConfigValidationSchema,
  ...authConfigValidationSchema,
});

import * as Joi from 'joi';
import { typeormConfigValidationSchema } from '@database/typeorm-config.validation';

export const configValidationSchema = Joi.object({
  APP_PORT: Joi.number(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  ...typeormConfigValidationSchema,
});

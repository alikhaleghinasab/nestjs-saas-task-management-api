import * as Joi from 'joi';
export const configValidationSchema = Joi.object({
  APP_PORT: Joi.number(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
});

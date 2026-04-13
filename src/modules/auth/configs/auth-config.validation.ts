import * as Joi from 'joi';

export const authConfigValidationSchema = {
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),

  JWT_REFRESH_SECRET: Joi.string().min(32).required(),

  ACCESS_TOKEN_EXPIRES_IN: Joi.number()
    .positive()
    .default(900)
    .description('Access token lifetime in seconds'),

  REFRESH_TOKEN_EXPIRES_IN: Joi.number()
    .positive()
    .default(604800)
    .description('Refresh token lifetime in seconds'),

  PASSWORD_SALT_ROUNDS: Joi.number().integer().min(10).default(10),
};

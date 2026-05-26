import * as Joi from 'joi';

export const authConfigValidationSchema = {
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),

  ACCESS_TOKEN_EXPIRES_IN: Joi.number()
    .positive()
    .default(900)
    .description('Access token lifetime in seconds'),

  REFRESH_TOKEN_EXPIRES_IN: Joi.number()
    .positive()
    .default(604800)
    .description('Refresh token lifetime in seconds'),
};

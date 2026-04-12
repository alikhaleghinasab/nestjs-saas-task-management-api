import * as Joi from 'joi';
import { ALLOWED_DB_TYPES } from './database.constant';

export const typeormConfigValidationSchema = {
  DATABASE_CONNECTION: Joi.string()
    .valid(...ALLOWED_DB_TYPES)
    .required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_DB_NAME: Joi.string().required(),
};

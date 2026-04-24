import * as Joi from 'joi';

export const rabbitmqConfigValidationSchema = {
  RABBITMQ_PROTOCOL: Joi.string().default('amqp').optional(),

  RABBITMQ_HOST: Joi.string().hostname().default('localhost').required(),

  RABBITMQ_PORT: Joi.number().port().default(5672).required(),

  RABBITMQ_USER: Joi.string().required(),

  RABBITMQ_PASSWORD: Joi.string().required(),
};

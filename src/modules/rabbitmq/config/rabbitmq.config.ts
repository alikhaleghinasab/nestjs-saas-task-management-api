import { ConfigType, registerAs } from '@nestjs/config';

const rabbitMQConfig = registerAs('rabbitMQ', () => ({
  protocol: process.env.RABBITMQ_PROTOCOL ?? 'amqp',
  host: process.env.RABBITMQ_HOST ?? 'localhost',
  port: Number(process.env.RABBITMQ_PORT ?? '5672'),
  user: process.env.RABBITMQ_USER,
  password: process.env.RABBITMQ_PASSWORD,
}));

export default rabbitMQConfig;
export type RabbitMQConfigType = ConfigType<typeof rabbitMQConfig>;

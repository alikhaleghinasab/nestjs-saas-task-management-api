import * as amqp from 'amqplib';

export type RabbitMQConnectionHandler = (
  channel: amqp.Channel,
) => Promise<void> | void;

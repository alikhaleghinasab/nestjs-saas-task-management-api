interface RabbitMQEvent {
  exchange: string;
  routingKey: string;
}

export type RabbitMQEvents = Record<string, RabbitMQEvent>;

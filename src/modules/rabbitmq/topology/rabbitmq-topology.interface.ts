interface RabbitMQExchange {
  name: string;
  type: 'topic' | 'direct' | 'headers' | 'fanout';
  durable?: boolean;
}

interface RabbitMQQueue {
  name: string;
  durable?: boolean;
}

interface RabbitMQBinding {
  exchange: string;
  queue: string;
  routingKey: string;
}

export interface RabbitMQTopology {
  exchanges: RabbitMQExchange[];

  bindings: RabbitMQBinding[];

  queues: RabbitMQQueue[];
}

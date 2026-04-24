export type RabbitMQRegistryItem = {
  event: string;
  exchange: string;
  queue: string;
  routeKey?: string;
};

export type RabbitMQRegistry = RabbitMQRegistryItem[];

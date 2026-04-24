export type RabbitMQRegistryItem = {
  event: string;
  exchange: string;
  routeKey?: string;
};

export type RabbitMQRegistry = RabbitMQRegistryItem[];

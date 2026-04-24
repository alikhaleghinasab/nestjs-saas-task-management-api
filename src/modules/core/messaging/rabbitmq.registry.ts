import { organizationRabbitMQRegistry } from '@organizations/messaging/rabbitmq.registry';
import { RabbitMQRegistry } from '@rabbitmq/publisher/interfaces/rabbitmq-registry.interface';

export const rabbitMQRegistry: RabbitMQRegistry = [
  ...organizationRabbitMQRegistry,
];

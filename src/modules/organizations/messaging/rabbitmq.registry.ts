import { RabbitMQRegistry } from '@rabbitmq/publisher/interfaces/rabbitmq-registry.interface';
import { OrganizationEvents } from './events/organization.events';
import { organizationExchange } from './rabbitmq.topology';

export const organizationRabbitMQRegistry: RabbitMQRegistry = [
  {
    event: OrganizationEvents.USER_INVITED,
    exchange: organizationExchange,
  },
] as const;

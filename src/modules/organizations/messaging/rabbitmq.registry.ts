import { RabbitMQRegistry } from '@rabbitmq/publisher/interfaces/rabbitmq-registry.interface';
import { OrganizationEvents } from './events/organization.events';
import {
  organizationExchange,
  userInvitedEmailQueue,
} from './rabbitmq.topology';

export const organizationRabbitMQRegistry: RabbitMQRegistry = [
  {
    event: OrganizationEvents.USER_INVITED,
    exchange: organizationExchange,
    queue: userInvitedEmailQueue,
  },
] as const;

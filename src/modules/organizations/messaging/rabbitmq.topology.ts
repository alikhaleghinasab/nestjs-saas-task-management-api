import { RabbitMQTopology } from '@rabbitmq/topology/rabbitmq-topology.interface';
export const organizationExchange = 'organization';
export const userInvitedEmailQueue = 'user.invited.email';
export const organizationRabbitMQTopology: RabbitMQTopology = {
  exchanges: [
    {
      name: organizationExchange,
      type: 'topic',
    },
  ],

  bindings: [
    {
      exchange: organizationExchange,
      queue: userInvitedEmailQueue,
      routingKey: 'user.invited',
    },
  ],

  queues: [
    {
      name: userInvitedEmailQueue,
      durable: true,
      deadLetter: true,
    },
  ],
} as const;

import { organizationRabbitMQTopology } from '@organizations/messaging/rabbitmq.topology';
import { RabbitMQTopology } from '@rabbitmq/topology/rabbitmq-topology.interface';
import { healthRabbitMQTopology } from 'modules/health/messaging/rabbitmq.topology';

export const rabbitMQTopology: RabbitMQTopology = {
  exchanges: [...organizationRabbitMQTopology.exchanges],
  bindings: [...organizationRabbitMQTopology.bindings],
  queues: [
    ...organizationRabbitMQTopology.queues,
    ...healthRabbitMQTopology.queues,
  ],
};

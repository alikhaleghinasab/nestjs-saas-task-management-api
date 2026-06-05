import { RabbitMQTopology } from '@rabbitmq/topology/rabbitmq-topology.interface';
import { RABBITMQ_HEALTH_QUEUE } from '../health.constants';

export const healthRabbitMQTopology: RabbitMQTopology = {
  exchanges: [],

  bindings: [],

  queues: [
    {
      name: RABBITMQ_HEALTH_QUEUE,
      durable: false,
      deadLetter: false,
    },
  ],
} as const;

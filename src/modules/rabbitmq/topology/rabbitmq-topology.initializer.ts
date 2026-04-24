import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  RABBITMQ_GLOBAL_DLX,
  RABBITMQ_TOPOLOGY,
} from '../constants/rabbitmq.constant';
import { RabbitMQTopology } from './rabbitmq-topology.interface';
import { RabbitMQService } from '../channel/rabbitmq.service';

@Injectable()
export class RabbitMQTopologyInitializer implements OnModuleInit {
  constructor(
    private readonly rabbit: RabbitMQService,
    @Inject(RABBITMQ_TOPOLOGY)
    private readonly topology: RabbitMQTopology,
  ) {}

  async onModuleInit() {
    await this.rabbit.waitForConnection();
    const channel = this.rabbit.getChannel();

    for (const exchange of this.topology.exchanges) {
      await channel.assertExchange(exchange.name, exchange.type, {
        durable: exchange.durable ?? true,
      });
    }

    for (const queue of this.topology.queues) {
      const args: Record<string, any> = {};

      if (queue.deadLetter) {
        const dlx = RABBITMQ_GLOBAL_DLX;

        await channel.assertExchange(dlx, 'topic', { durable: true });

        const dlqName = `${queue.name}.dlq`;

        await channel.assertQueue(dlqName, {
          durable: true,
        });

        await channel.bindQueue(dlqName, dlx, queue.name);

        args['x-dead-letter-exchange'] = dlx;
        args['x-dead-letter-routing-key'] = queue.name;
      }

      await channel.assertQueue(queue.name, {
        durable: queue.durable,
        arguments: args,
      });
    }

    for (const binding of this.topology.bindings) {
      await channel.bindQueue(
        binding.queue,
        binding.exchange,
        binding.routingKey,
      );
    }
  }
}

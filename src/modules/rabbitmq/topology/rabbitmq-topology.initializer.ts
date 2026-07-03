import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  RABBITMQ_GLOBAL_DLX,
  RABBITMQ_TOPOLOGY,
} from '../constants/rabbitmq.constant';
import { RabbitMQTopology } from './rabbitmq-topology.interface';
import { RabbitMQService } from '../channel/rabbitmq.service';
import { RabbitMQLifecycle } from '../lifecycle/rabbitmq-lifecycle.service';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQTopologyInitializer implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQTopologyInitializer.name);

  constructor(
    private readonly rabbit: RabbitMQService,
    private readonly lifecycle: RabbitMQLifecycle,
    @Inject(RABBITMQ_TOPOLOGY)
    private readonly topology: RabbitMQTopology,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbit.onConnected((channel) => this.initialize(channel));
  }

  private async initialize(channel: amqp.Channel): Promise<void> {
    this.logger.log('Initializing RabbitMQ topology');

    await this.createExchanges(channel);
    await this.createQueues(channel);
    await this.createBindings(channel);

    this.logger.log('RabbitMQ topology initialized');

    await this.lifecycle.notifyTopologyReady(channel);
  }

  private async createExchanges(channel: amqp.Channel): Promise<void> {
    for (const exchange of this.topology.exchanges) {
      await channel.assertExchange(exchange.name, exchange.type, {
        durable: exchange.durable ?? true,
      });
    }
  }

  private async createQueues(channel: amqp.Channel): Promise<void> {
    for (const queue of this.topology.queues) {
      const args: Record<string, unknown> = {};

      if (queue.deadLetter) {
        const dlx = RABBITMQ_GLOBAL_DLX;

        await channel.assertExchange(dlx, 'topic', {
          durable: true,
        });

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
  }

  private async createBindings(channel: amqp.Channel): Promise<void> {
    for (const binding of this.topology.bindings) {
      await channel.bindQueue(
        binding.queue,
        binding.exchange,
        binding.routingKey,
      );
    }
  }
}

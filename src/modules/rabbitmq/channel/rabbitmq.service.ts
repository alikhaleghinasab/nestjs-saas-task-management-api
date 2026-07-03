import { Injectable } from '@nestjs/common';
import { RabbitMQConnectionManager } from '../connection/rabbitmq-connection.manager';
import * as amqp from 'amqplib';
import { RabbitMQLifecycle } from '@rabbitmq/lifecycle/rabbitmq-lifecycle.service';
@Injectable()
export class RabbitMQService {
  constructor(
    private readonly manager: RabbitMQConnectionManager,
    private readonly lifecycle: RabbitMQLifecycle,
  ) {}

  getChannel(): amqp.Channel | undefined {
    return this.manager.getChannel();
  }

  isConnected(): boolean {
    return this.manager.isConnected();
  }

  async onConnected(
    handler: (channel: amqp.Channel) => Promise<void>,
  ): Promise<void> {
    await this.lifecycle.onConnected(handler);
  }

  async onTopologyReady(
    handler: (channel: amqp.Channel) => Promise<void>,
  ): Promise<void> {
    await this.lifecycle.onTopologyReady(handler);
  }
}

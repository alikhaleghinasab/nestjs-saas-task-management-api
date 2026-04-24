import { Injectable } from '@nestjs/common';
import { RabbitMQConnectionManager } from '../connection/rabbitmq-connection.manager';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  constructor(private readonly manager: RabbitMQConnectionManager) {}

  async waitForConnection(): Promise<void> {
    return this.manager.waitUntilReady();
  }

  getChannel(): amqp.Channel {
    return this.manager.getChannel();
  }
}

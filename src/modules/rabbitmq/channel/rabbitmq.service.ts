import { Injectable } from '@nestjs/common';
import { RabbitMQConnectionManager } from '../connection/rabbitmq-connection.manager';
import * as amqp from 'amqplib';
import { RabbitMQConnectionHandler } from '@rabbitmq/types/rabbitmq-connection-handler.type';

@Injectable()
export class RabbitMQService {
  constructor(private readonly manager: RabbitMQConnectionManager) {}

  getChannel(): amqp.Channel | undefined {
    return this.manager.getChannel();
  }

  isConnected(): boolean {
    return this.manager.isConnected();
  }

  onConnected(handler: RabbitMQConnectionHandler): void {
    this.manager.onConnected(handler);
  }
}

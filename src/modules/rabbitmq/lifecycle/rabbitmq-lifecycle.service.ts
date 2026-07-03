import { Injectable, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RabbitMQLifecycleStage } from './rabbitmq-lifecycle-stage.enum';

type LifecycleHandler = (channel: amqp.Channel) => Promise<void>;
@Injectable()
export class RabbitMQLifecycle {
  private readonly logger = new Logger(RabbitMQLifecycle.name);

  private channel?: amqp.Channel;

  private connected = false;
  private topologyReady = false;

  private readonly connectedHandlers: LifecycleHandler[] = [];
  private readonly topologyReadyHandlers: LifecycleHandler[] = [];

  async onConnected(handler: LifecycleHandler): Promise<void> {
    this.connectedHandlers.push(handler);

    if (this.connected && this.channel) {
      await handler(this.channel);
    }
  }

  async onTopologyReady(handler: LifecycleHandler): Promise<void> {
    this.topologyReadyHandlers.push(handler);

    if (this.topologyReady && this.channel) {
      await handler(this.channel);
    }
  }

  async notifyConnected(channel: amqp.Channel): Promise<void> {
    this.channel = channel;
    this.connected = true;
    this.topologyReady = false;

    await this.executeHandlers(
      this.connectedHandlers,
      channel,
      RabbitMQLifecycleStage.Connected,
    );
  }

  async notifyTopologyReady(channel: amqp.Channel): Promise<void> {
    this.topologyReady = true;

    await this.executeHandlers(
      this.topologyReadyHandlers,
      channel,
      RabbitMQLifecycleStage.TopologyReady,
    );
  }

  reset(): void {
    this.channel = undefined;
    this.connected = false;
    this.topologyReady = false;
  }

  private async executeHandlers(
    handlers: LifecycleHandler[],
    channel: amqp.Channel,
    stage: RabbitMQLifecycleStage,
  ): Promise<void> {
    for (const handler of handlers) {
      try {
        await handler(channel);
      } catch (error) {
        this.logger.error(`RabbitMQ lifecycle stage "${stage}" failed`, error);

        throw error;
      }
    }
  }
}

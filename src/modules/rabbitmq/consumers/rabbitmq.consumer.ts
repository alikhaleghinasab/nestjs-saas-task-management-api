import { MessageConsumer } from '@messaging/messaging-consumer.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from '@rabbitmq/channel/rabbitmq.service';
import { RABBITMQ_REGISTRY } from '@rabbitmq/constants/rabbitmq.constant';
import {
  RabbitMQRegistry,
  RabbitMQRegistryItem,
} from '@rabbitmq/publisher/interfaces/rabbitmq-registry.interface';
import * as amqp from 'amqplib';

interface Subscription {
  event: string;
  queue: string;
  handler: (payload: any) => Promise<void>;
}

@Injectable()
export class RabbitMQConsumer implements MessageConsumer {
  private readonly logger = new Logger(RabbitMQConsumer.name);

  private readonly routes: Map<string, RabbitMQRegistryItem>;

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly rabbit: RabbitMQService,
    @Inject(RABBITMQ_REGISTRY)
    registry: RabbitMQRegistry,
  ) {
    this.routes = new Map(registry.map((route) => [route.event, route]));

    this.rabbit.onConnected((channel) => this.restoreSubscriptions(channel));
  }

  async subscribe(
    event: string,
    handler: (payload: any) => Promise<void>,
  ): Promise<void> {
    const queue = this.resolveQueue(event);

    this.subscriptions.push({
      event,
      queue,
      handler,
    });

    const channel = this.rabbit.getChannel();

    if (!channel) {
      this.logger.warn(
        `Skipping RabbitMQ subscription for ${event}: broker unavailable`,
      );
      return;
    }

    await this.consume(event, queue, handler, channel);
  }

  private async consume(
    event: string,
    queue: string,
    handler: (payload: any) => Promise<void>,
    channel: amqp.Channel,
  ): Promise<void> {
    await channel.consume(queue, async (msg) => {
      if (!msg) {
        return;
      }

      try {
        const payload = JSON.parse(msg.content.toString());

        await handler(payload);

        channel.ack(msg);
      } catch (error) {
        this.logger.error(`Failed to process event ${event}`, error);

        channel.nack(msg, false, false);
      }
    });
  }

  private resolveQueue(event: string): string {
    const queue = this.routes.get(event)?.queue;

    if (!queue) {
      throw new Error(`No messaging queue found for event: ${event}`);
    }

    return queue;
  }

  private async restoreSubscriptions(channel: amqp.Channel): Promise<void> {
    this.logger.log(
      `Restoring ${this.subscriptions.length} RabbitMQ subscriptions`,
    );

    const results = await Promise.allSettled(
      this.subscriptions.map((subscription) =>
        this.consume(
          subscription.event,
          subscription.queue,
          subscription.handler,
          channel,
        ),
      ),
    );

    results.forEach((result) => {
      if (result.status === 'rejected') {
        this.logger.error(
          'Failed restoring RabbitMQ subscription',
          result.reason,
        );
      }
    });
  }
}

import { MessageConsumer } from '@messaging/messaging-consumer.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from '@rabbitmq/channel/rabbitmq.service';
import { RABBITMQ_REGISTRY } from '@rabbitmq/constants/rabbitmq.constant';
import {
  RabbitMQRegistry,
  RabbitMQRegistryItem,
} from '@rabbitmq/publisher/interfaces/rabbitmq-registry.interface';

@Injectable()
export class RabbitMQConsumer implements MessageConsumer {
  private readonly routes: Map<string, RabbitMQRegistryItem>;
  private readonly logger = new Logger(RabbitMQConsumer.name);

  constructor(
    private readonly rabbit: RabbitMQService,
    @Inject(RABBITMQ_REGISTRY)
    registry: RabbitMQRegistry,
  ) {
    this.routes = new Map(registry.map((r) => [r.event, r]));
  }

  async subscribe(event: string, handler: (payload: any) => Promise<void>) {
    const channel = this.rabbit.getChannel();

    const queue = this.resolveQueue(event);

    await channel.prefetch(10);

    await channel.consume(queue, async (msg) => {
      if (!msg) return;

      const payload = JSON.parse(msg.content.toString());

      try {
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
}

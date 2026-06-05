import { Inject, Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from '../channel/rabbitmq.service';
import { MessagePublisher } from '@messaging/messaging-publisher.interface';
import { RABBITMQ_REGISTRY } from '../constants/rabbitmq.constant';
import {
  RabbitMQRegistry,
  RabbitMQRegistryItem,
} from './interfaces/rabbitmq-registry.interface';
import { MessageBrokerUnavailableError } from '@messaging/errors/message-broker-unavailable.error';

@Injectable()
export class RabbitMQPublisher implements MessagePublisher {
  private readonly logger = new Logger(RabbitMQPublisher.name);
  private readonly routes: Map<string, RabbitMQRegistryItem>;

  constructor(
    private readonly rabbit: RabbitMQService,
    @Inject(RABBITMQ_REGISTRY)
    registry: RabbitMQRegistry,
  ) {
    this.routes = new Map(registry.map((r) => [r.event, r]));
  }

  async publish<T>(event: string, payload: T): Promise<void> {
    const route = this.routes.get(event);

    if (!route) {
      throw new Error(`No messaging route found for event: ${event}`);
    }

    const channel = this.rabbit.getChannel();

    if (!channel) {
      this.logger.warn(
        `Skipping RabbitMQ publish for ${event}: broker unavailable`,
      );
      throw new MessageBrokerUnavailableError();
    }

    const success = channel.publish(
      route.exchange,
      route.routeKey ?? route.event,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true },
    );

    if (!success) {
      // log only, no backpressure handling needed (kept simple intentionally)
      this.logger.warn('RabbitMQ buffer is full (publish returned false)');
    }
  }
}

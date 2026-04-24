import { Module } from '@nestjs/common';
import { RabbitMQService } from './channel/rabbitmq.service';
import { RabbitMQPublisher } from './publisher/rabbitmq.publisher';
import { ConfigModule } from '@nestjs/config';
import rabbitMQConfig from './config/rabbitmq.config';
import {
  RABBITMQ_REGISTRY,
  RABBITMQ_TOPOLOGY,
} from './constants/rabbitmq.constant';
import { rabbitMQTopology } from '@core/messaging/rabbitmq.topology';
import { RabbitMQTopologyInitializer } from './topology/rabbitmq-topology.initializer';
import { rabbitMQRegistry } from '@core/messaging/rabbitmq.registry';
import { RabbitMQConnectionManager } from './connection/rabbitmq-connection.manager';
import { RabbitMQConsumer } from './consumers/rabbitmq.consumer';

@Module({
  imports: [ConfigModule.forFeature(rabbitMQConfig)],
  providers: [
    RabbitMQService,
    RabbitMQTopologyInitializer,
    RabbitMQConnectionManager,
    RabbitMQPublisher,
    RabbitMQConsumer,
    {
      provide: RABBITMQ_TOPOLOGY,
      useValue: rabbitMQTopology,
    },
    {
      provide: RABBITMQ_REGISTRY,
      useValue: rabbitMQRegistry,
    },
  ],
  exports: [
    RabbitMQService,
    RabbitMQPublisher,
    RabbitMQConsumer,
    RABBITMQ_REGISTRY,
  ],
})
export class RabbitMQModule {}

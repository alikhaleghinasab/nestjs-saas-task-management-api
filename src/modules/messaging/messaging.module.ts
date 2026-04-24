import { Module } from '@nestjs/common';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { RabbitMQPublisher } from '../rabbitmq/publisher/rabbitmq.publisher';
import { MESSAGE_CONSUMER, MESSAGE_PUBLISHER } from './messaging.constant';
import { RabbitMQConsumer } from '@rabbitmq/consumers/rabbitmq.consumer';

@Module({
  imports: [RabbitMQModule],
  providers: [
    {
      provide: MESSAGE_PUBLISHER,
      useClass: RabbitMQPublisher,
    },
    {
      provide: MESSAGE_CONSUMER,
      useClass: RabbitMQConsumer,
    },
  ],
  exports: [MESSAGE_PUBLISHER, MESSAGE_CONSUMER],
})
export class MessagingModule {}

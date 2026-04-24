import { Module } from '@nestjs/common';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { RabbitMQPublisher } from '../rabbitmq/publisher/rabbitmq.publisher';
import { MESSAGE_PUBLISHER } from './messaging.constant';

@Module({
  imports: [RabbitMQModule],
  providers: [
    {
      provide: MESSAGE_PUBLISHER,
      useClass: RabbitMQPublisher,
    },
  ],
  exports: [MESSAGE_PUBLISHER],
})
export class MessagingModule {}

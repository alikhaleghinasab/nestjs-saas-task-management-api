import { RabbitMQService } from '@rabbitmq/channel/rabbitmq.service';
import { UserInvitedHandler } from '../handlers/user-invited.handler';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { userInvitedEmailQueue } from '../rabbitmq.topology';

@Injectable()
export class InvitationConsumer implements OnModuleInit {
  private readonly QUEUE = userInvitedEmailQueue;

  constructor(
    private readonly rabbit: RabbitMQService,
    private readonly handler: UserInvitedHandler,
  ) {}

  async onModuleInit() {
    await this.rabbit.waitForConnection();
    const channel = this.rabbit.getChannel();

    await channel.prefetch(10);

    await channel.consume(this.QUEUE, async (msg) => {
      if (!msg) return;

      const payload = JSON.parse(msg.content.toString());

      try {
        await this.handler.handle(payload);
        channel.ack(msg);
      } catch (err) {
        channel.nack(msg, false, true);
      }
    });
  }
}

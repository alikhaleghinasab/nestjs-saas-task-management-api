import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OrganizationEvents } from '../events/organization.events';
import { UserInvitedHandler } from '../handlers/user-invited.handler';
import { MessageConsumer } from '@messaging/messaging-consumer.interface';
import { MESSAGE_CONSUMER } from '@messaging/messaging.constant';

@Injectable()
export class InvitationEventConsumer implements OnModuleInit {
  constructor(
    @Inject(MESSAGE_CONSUMER)
    private readonly consumer: MessageConsumer,
    private readonly handler: UserInvitedHandler,
  ) {}

  async onModuleInit() {
    await this.consumer.subscribe(
      OrganizationEvents.USER_INVITED,
      this.handler.handle.bind(this.handler),
    );
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { OrganizationEvents } from '../events/organization.events';
import { MESSAGE_PUBLISHER } from '@messaging/messaging.constant';
import { MessagePublisher } from '@messaging/messaging-publisher.interface';
import { UserInvitedEvent } from '../events/user-invited.event';

@Injectable()
export class OrganizationEventPublisher {
  constructor(
    @Inject(MESSAGE_PUBLISHER)
    private readonly publisher: MessagePublisher,
  ) {}

  async userInvited(payload: UserInvitedEvent) {
    await this.publisher.publish(OrganizationEvents.USER_INVITED, payload);
  }
}

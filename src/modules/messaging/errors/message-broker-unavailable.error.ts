import { MESSAGING_ERRORS } from '@messaging/constants/errors.constant';

export class MessageBrokerUnavailableError extends Error {
  constructor() {
    super(MESSAGING_ERRORS.MESSAGE_BROKER_UNAVAILABLE);
  }
}

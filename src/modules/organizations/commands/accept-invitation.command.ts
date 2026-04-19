import { User } from '@users/entities/user.entity';

export class AcceptInvitationCommand {
  constructor(
    public readonly token: string,
    public readonly user: Pick<User, 'id' | 'email'>,
  ) {}
}

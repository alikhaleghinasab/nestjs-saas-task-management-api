import { Roles } from '@memberships/enums/roles.enum';

export class CreateMembershipCommand {
  constructor(
    public readonly organizationId: string,
    public readonly userId: string,
    public readonly role: Roles,
  ) {}
}

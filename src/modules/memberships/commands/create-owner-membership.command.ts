export class CreateOwnerMembershipCommand {
  constructor(
    public readonly organizationId: string,
    public readonly userId: string,
  ) {}
}

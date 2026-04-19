export class CreateMembershipCommand {
  constructor(
    public readonly organizationId: string,
    public readonly userId: string,
    public readonly role: string,
  ) {}
}

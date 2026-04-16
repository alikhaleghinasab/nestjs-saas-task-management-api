export class DeleteMembershipCommand {
  constructor(
    public readonly organizationId: string,
    public readonly userId: string,
  ) {}
}

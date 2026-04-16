import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MembershipService } from '@memberships/services/membership.service';
import { DeleteMembershipCommand } from '@memberships/commands/delete-membership.command';

@CommandHandler(DeleteMembershipCommand)
export class DeleteMembershipHandler implements ICommandHandler<DeleteMembershipCommand> {
  private readonly logger = new Logger(DeleteMembershipHandler.name);

  constructor(private readonly membershipService: MembershipService) {}

  async execute(command: DeleteMembershipCommand): Promise<void> {
    this.logger.log(
      `Executing DeleteMembershipCommand for org: ${command.organizationId}`,
    );

    await this.membershipService.delete(command.userId, command.organizationId);
  }
}

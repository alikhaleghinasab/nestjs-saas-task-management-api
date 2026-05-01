import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MembershipService } from '@memberships/services/membership.service';
import { CreateMembershipCommand } from '@memberships/commands/create-membership.command';

@CommandHandler(CreateMembershipCommand)
export class CreateMembershipHandler implements ICommandHandler<CreateMembershipCommand> {
  private readonly logger = new Logger(CreateMembershipHandler.name);

  constructor(private readonly membershipService: MembershipService) {}

  async execute(command: CreateMembershipCommand): Promise<void> {
    this.logger.log(
      `Executing CreateMembershipCommand for org: ${command.organizationId}`,
    );

    await this.membershipService.create({
      organizationId: command.organizationId,
      userId: command.userId,
      role: command.role,
    });
  }
}

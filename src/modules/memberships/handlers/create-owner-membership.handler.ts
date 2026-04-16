import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CreateOwnerMembershipCommand } from '../commands/create-owner-membership.command';
import { MembershipService } from '@memberships/services/membership.service';
import { RolesEnum } from '@memberships/enums/roles.enum';

@CommandHandler(CreateOwnerMembershipCommand)
export class CreateOwnerMembershipHandler implements ICommandHandler<CreateOwnerMembershipCommand> {
  private readonly logger = new Logger(CreateOwnerMembershipHandler.name);

  constructor(private readonly membershipService: MembershipService) {}

  async execute(command: CreateOwnerMembershipCommand): Promise<void> {
    this.logger.log(
      `Executing CreateOwnerMembershipCommand for org: ${command.organizationId}`,
    );

    await this.membershipService.create({
      organizationId: command.organizationId,
      userId: command.userId,
      role: RolesEnum.Owner,
    });
  }
}

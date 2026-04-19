import { CommandHandler } from '@nestjs/cqrs';
import { AcceptInvitationCommand } from '@organizations/commands/accept-invitation.command';
import { AcceptInvitationDto } from '@organizations/dto/accept-invitation.dto';
import { InvitationService } from '@organizations/services/invitation.service';

@CommandHandler(AcceptInvitationCommand)
export class AcceptInvitationHandler {
  constructor(private readonly invitationService: InvitationService) {}

  async execute(
    command: AcceptInvitationCommand,
  ): Promise<AcceptInvitationDto> {
    return this.invitationService.acceptInvitation(command.token, command.user);
  }
}

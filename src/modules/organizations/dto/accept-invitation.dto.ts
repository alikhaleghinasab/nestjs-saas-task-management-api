import { ApiProperty } from '@nestjs/swagger';

export class AcceptInvitationDto {
  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  role: string;
}

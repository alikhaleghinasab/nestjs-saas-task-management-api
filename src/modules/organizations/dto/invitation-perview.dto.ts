import { ApiProperty } from '@nestjs/swagger';

export class InvitationPreviewDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  organizationName: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  createdAt: Date;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { AuthCredentialsDto } from './base-auth.dto';

export class RegisterDto extends AuthCredentialsDto {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly firstName: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly lastName: string;

  @ApiPropertyOptional({
    description:
      'Invitation token used to join an organization during registration',
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  readonly invitationToken?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export abstract class AuthCredentialsDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john@example.com',
  })
  @Transform(({ value }) => value?.trim())
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'Password for authentication. Must be at least 8 chars.',
    example: 'StrongPass123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/, {
    message: 'Password must contain uppercase, lowercase letters, and digits',
  })
  readonly password: string;
}

import { Roles } from '@memberships/enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class InviteUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john@example.com',
  })
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ enum: Roles })
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;
}

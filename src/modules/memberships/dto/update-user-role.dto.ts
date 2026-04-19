import { Roles } from '@memberships/enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty({ enum: Roles })
  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;
}

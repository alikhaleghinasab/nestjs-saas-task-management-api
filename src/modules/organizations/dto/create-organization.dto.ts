import { ApiProperty } from '@nestjs/swagger';
import { CreateOrganizationParams } from '../interfaces/organization-params.interface.ts';
import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';

export class CreateOrganizationDto implements CreateOrganizationParams {
  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @ApiProperty({ example: 'acme-corp' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;
}

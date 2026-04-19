import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Human-readable project name',
    maxLength: 100,
    example: 'Marketing Website Migration',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Detailed description of the project',
    example: 'This project involves migrating our marketing website to Next.js',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(1)
  description: string;
}

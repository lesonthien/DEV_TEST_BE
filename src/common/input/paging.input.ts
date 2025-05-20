import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';
import { FindOptionsOrderValue } from 'typeorm';

import { TypeSort } from './sort.enum';

export class PagingInput {
  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumberString()
  page!: number;

  @ApiProperty({ default: 20 })
  @IsNotEmpty()
  @IsNumberString()
  limit!: number;

  @ApiPropertyOptional({ description: 'Key sort are same with column in entity' })
  @IsOptional()
  @IsString()
  keySort?: string;

  @ApiPropertyOptional({ description: 'Type sort: ASC and DESC' })
  @IsOptional()
  @IsEnum(TypeSort)
  typeSort?: FindOptionsOrderValue;
}

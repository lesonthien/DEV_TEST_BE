import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateDeptDto {
  @ApiProperty({ description: 'id' })
  @IsString()
  id!: string;

  @ApiProperty({ description: 'dept name' })
  @IsOptional()
  @IsString()
  deptName?: string;

  @ApiProperty({ description: 'use' })
  @IsOptional()
  @IsString()
  use?: string;

  @ApiProperty({ description: 'date stop' })
  @IsOptional()
  @IsDateString()
  dateStop?: Date;

  @ApiProperty({ description: 'manager' })
  @IsOptional()
  @IsString()
  manager?: string;

  @ApiProperty({ description: 'Created by' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({ description: 'Updated by' })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}

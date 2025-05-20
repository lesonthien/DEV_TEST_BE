import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PagingInput } from 'src/common/input/paging.input';

export class FilteDeptDto extends PagingInput {
  @ApiProperty({ description: 'id' })
  @IsOptional()
  @IsString()
  id?: string;

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

  @ApiProperty({ description: 'time create' })
  @IsOptional()
  @IsDateString()
  createdTime?: Date;

  @ApiProperty({ description: 'Updated by' })
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @ApiProperty({ description: 'time update' })
  @IsOptional()
  @IsDateString()
  timeUpdate?: Date;
}

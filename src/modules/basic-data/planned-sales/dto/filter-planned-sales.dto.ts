import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { PagingInput } from 'src/common/input/paging.input';

export class FilterPlannedSalesDto extends PagingInput {
  @ApiProperty({ description: 'Department No' })
  @IsOptional()
  @IsString()
  deptNo?: string;

  @ApiProperty({
    required: true,
  })
  @IsDateString()
  startDate!: string;

  @ApiProperty({
    required: true,
  })
  @IsDateString()
  endDate!: string;

  @ApiProperty({ description: 'Planned Sale' })
  @IsOptional()
  @IsNumber()
  planSale?: number;

  @ApiProperty({ description: 'Created by' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({ description: 'Updated by' })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlannedSalesDto {
  @ApiProperty({ description: 'Department No' })
  @IsNotEmpty()
  @IsString()
  deptNo!: string;

  @ApiProperty({
    description: 'Month in format YYYY-MM',
    example: '2025-04',
  })
  @IsNotEmpty()
  month!: string;

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

import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PagingInput } from 'src/common/input/paging.input';

export class FilterCountryDto extends PagingInput {
  @ApiProperty({ description: 'id' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'viet nam name' })
  @IsOptional()
  @IsString()
  vietNamName?: string;

  @ApiProperty({ description: 'english name' })
  @IsOptional()
  @IsString()
  englishName?: string;

  @ApiProperty({ description: 'chinese name' })
  @IsOptional()
  @IsString()
  chineseName?: string;

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

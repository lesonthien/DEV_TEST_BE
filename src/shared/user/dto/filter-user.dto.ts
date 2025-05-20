import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PagingInput } from 'src/common/input/paging.input';

export class FilterUserDto extends PagingInput {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;
}

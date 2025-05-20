import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PagingInput } from 'src/common/input/paging.input';

export class FilterPlannedSalesOneDto extends PagingInput {
  @IsString()
  @IsOptional({ message: 'All deptNo is %' })
  deptNo!: string;

  @IsString()
  @IsOptional({ message: 'month is null' })
  month?: Date;

  @Type(() => Number)
  @IsNumber()
  @IsOptional({ message: 'Target of month, must be > 0 or emty' })
  target?: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CompayInfoInput {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  factNo!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  branchNo!: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  userNo!: string;

  @ApiProperty()
  @IsString()
  userFact!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  userNm?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  userPw?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  matMk?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  userMail?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lockMk?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lockTime?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  addTime?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  usrUpd?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  updTime?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  userIdNo?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  sessionNo?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  logTime?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  deptNo?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  idNo?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  extNumber?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  branchNo?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  quyen?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;
}

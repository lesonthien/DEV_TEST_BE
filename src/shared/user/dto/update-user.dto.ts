/* eslint-disable import/no-extraneous-dependencies */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
// import { i18nValidationMessage } from 'nestjs-i18n';
// import { I18nTranslations } from 'src/generated/i18n.generated';

export class UpdateUserDto {
  @ApiPropertyOptional()
  // @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING') })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiPropertyOptional()
  // @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING') })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  // @IsDate({ message: i18nValidationMessage<I18nTranslations>('validation.IS_DATE') })
  @IsDate()
  @Type(() => Date)
  dob?: Date;

  @ApiPropertyOptional()
  // @IsNumber({}, { message: i18nValidationMessage<I18nTranslations>('validation.IS_NUMBER') })
  @IsNumber()
  @IsOptional()
  gender?: number;
}

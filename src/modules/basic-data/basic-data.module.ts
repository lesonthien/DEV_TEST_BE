import { Module } from '@nestjs/common';

import { CountryModule } from './country/country.module';
import { DeptModule } from './dept/dept.module';
import { PlannedSalesModule } from './planned-sales/planned-sales.module';

@Module({
  imports: [CountryModule, DeptModule, PlannedSalesModule],
})
export class BasicDataModule {}

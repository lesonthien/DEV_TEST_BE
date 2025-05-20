import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlannedSalesController } from './planned-sales.controller';
import { PlannedSales } from './planned-sales.entity';
import { PlannedSalesService } from './planned-sales.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlannedSales])],
  controllers: [PlannedSalesController],
  providers: [PlannedSalesService],
})
export class PlannedSalesModule {}

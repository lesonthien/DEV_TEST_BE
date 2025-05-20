import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/shared/request-with-user-type';

import { CreatePlannedSalesDto } from './dto/create-planned-sales.dto';
import { UpdatePlannedSalesDto } from './dto/update-planned-sales.dto';
import { PlannedSalesService } from './planned-sales.service';
import { FilterPlannedSalesDto } from './dto/filter-planned-sales.dto';

@ApiTags('Basic Data - Planned-Sales')
@Controller('basic-data/planned-sales')
export class PlannedSalesController {
  constructor(private readonly plannedSalesService: PlannedSalesService) {}

  @Get('/get-list')
  findAll(@Req() req: RequestWithUser, @Query() filter: FilterPlannedSalesDto) {
    const { factNo } = req.user;
    if (!factNo) {
      throw new BadRequestException('DeptNo is required');
    }

    return this.plannedSalesService.findAll(filter, factNo);
  }

  @Get(':deptNo/:month')
  findOne(@Param('deptNo') deptNo: string, @Param('month') month: Date, @Req() req: RequestWithUser) {
    const { factNo } = req.user;
    return this.plannedSalesService.findOne(deptNo, month, factNo);
  }

  @Post()
  create(@Req() req: RequestWithUser, @Body() createPlannedSalesDto: CreatePlannedSalesDto) {
    const { factNo } = req.user;
    const createdBy = req.user.id;
    return this.plannedSalesService.create({ ...createPlannedSalesDto, createdBy }, factNo);
  }

  @Patch(':deptNo/:month')
  update(
    @Param('deptNo') deptNo: string,
    @Param('month') month: Date,
    @Req() req: RequestWithUser,
    @Body() updatePlannedSalesDto: UpdatePlannedSalesDto,
  ) {
    const { factNo } = req.user;
    const updatedBy = req.user.id;
    return this.plannedSalesService.update(deptNo, month, factNo, { ...updatePlannedSalesDto, updatedBy });
  }

  @Delete(':deptNo/:month')
  remove(@Param('deptNo') deptNo: string, @Param('month') month: Date, @Req() req: RequestWithUser) {
    const { factNo } = req.user;
    return this.plannedSalesService.remove(deptNo, month, factNo);
  }
}

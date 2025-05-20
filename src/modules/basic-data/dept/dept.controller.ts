import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/shared/request-with-user-type';

import { DeptService } from './dept.service';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
import { FilteDeptDto } from './dto/fillter-dept.dto';

@ApiTags('Basic Data - Dept')
@Controller('basic-data/dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Get()
  findAll(@Req() req: RequestWithUser, @Query() filter: FilteDeptDto) {
    const { factNo, branchNo } = req.user;
    return this.deptService.findAll(filter, factNo, branchNo);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const { factNo, branchNo } = req.user;
    return this.deptService.findOne(id, branchNo, factNo);
  }

  @Post()
  create(@Req() req: RequestWithUser, @Body() createDeptDto: CreateDeptDto) {
    const { factNo, branchNo } = req.user;
    const createdBy = req.user.username;
    return this.deptService.create({ ...createDeptDto, createdBy }, factNo, branchNo);
  }

  @Patch(':id/:branchNo')
  update(@Param('id') id: string, @Param('branchNo') branchNo: string, @Req() req: RequestWithUser, @Body() updateDeptDto: UpdateDeptDto) {
    const { factNo } = req.user;
    const updatedBy = req.user.username;
    return this.deptService.update(id, branchNo, factNo, { ...updateDeptDto, updatedBy });
  }

  @Delete(':id/:branchNo')
  remove(@Param('id') id: string, @Param('branchNo') branchNo: string, @Req() req: RequestWithUser) {
    const { factNo } = req.user;
    return this.deptService.remove(id, branchNo, factNo);
  }
}

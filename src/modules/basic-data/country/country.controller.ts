import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/shared/request-with-user-type';

import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { FilterCountryDto } from './dto/fillter-country.dto';

@ApiTags('Basic Data - Country')
@Controller('basic-data/country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  findAll(@Req() req: RequestWithUser, @Query() filter: FilterCountryDto) {
    const { factNo } = req.user;
    if (!factNo) {
      throw new BadRequestException('factNo is required');
    }
    return this.countryService.findAll(filter, factNo);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const { factNo } = req.user;
    return this.countryService.findOne(id, factNo);
  }

  @Post()
  create(@Req() req: RequestWithUser, @Body() createCountryDto: CreateCountryDto) {
    const { factNo } = req.user;
    const createdBy = req.user.username;

    return this.countryService.create({ ...createCountryDto, createdBy }, factNo);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: RequestWithUser, @Body() updateCountryDto: UpdateCountryDto) {
    const { factNo } = req.user;
    const updatedBy = req.user.username;

    return this.countryService.update(id, factNo, { ...updateCountryDto, updatedBy });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    const { factNo } = req.user;
    return this.countryService.remove(id, factNo);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getUtcDate } from 'src/helpers/date';
import { PagingViewResponse } from 'src/views/pagingViewResponse';
import { FindOptionsWhere, Raw, Repository } from 'typeorm';

import { Country } from './country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { FilterCountryDto } from './dto/fillter-country.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async findAll(filter: FilterCountryDto, factNo: string) {
    const { page, limit, keySort, typeSort, id, vietNamName, englishName, chineseName, createdBy, createdTime, updatedBy } = filter;
    const currentPage = page && page > 0 ? page : 1;
    const pageLimit = limit && limit > 0 ? limit : 10;
    const offset = (currentPage - 1) * pageLimit;
    const where: FindOptionsWhere<Country> = { factNo };

    if (id) {
      where.id = Raw((alias) => `UPPER(${alias}) LIKE UPPER(:id)`, { id: `%${id}%` });
    }

    if (vietNamName) {
      where.vietNamName = Raw((alias) => `UPPER(${alias}) LIKE UPPER(:vietNamName)`, { vietNamName: `%${vietNamName}%` });
    }

    if (englishName) {
      where.englishName = Raw((alias) => `UPPER(${alias}) LIKE UPPER(:englishName)`, { englishName: `%${englishName}%` });
    }

    if (chineseName) {
      where.chineseName = Raw((alias) => `UPPER(${alias}) LIKE UPPER(:chineseName)`, { chineseName: `%${chineseName}%` });
    }

    if (createdBy) {
      where.createdBy = createdBy;
    }

    if (createdTime) {
      where.createdTime = createdTime;
    }

    if (updatedBy) {
      where.updatedBy = updatedBy;
    }

    const [result, total] = await this.countryRepository.findAndCount({
      where,
      order: {
        [keySort ?? 'vietNamName']: typeSort ?? 'DESC',
      },
      take: pageLimit,
      skip: offset,
    });

    if (!result.length) {
      return PagingViewResponse.from({
        page: currentPage,
        limit: pageLimit,
        total,
        rows: [],
      });
    }

    return PagingViewResponse.from({ page: currentPage, limit: pageLimit, total, rows: result });
  }

  async findOne(id: string, factNo: string) {
    const country = await this.countryRepository.findOne({
      where: { id, factNo },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found.`);
    }

    return country;
  }

  async create(createCountryDto: CreateCountryDto, factNo: string): Promise<Country> {
    const createdTime = getUtcDate();
    const country = this.countryRepository.create({ ...createCountryDto, factNo, createdTime, updatedTime: createdTime });
    return this.countryRepository.save(country);
  }

  async update(id: string, factNo: string, updateCountryDto: Partial<Country>): Promise<Country> {
    const updatedTime = getUtcDate();
    await this.countryRepository.update({ factNo, id }, { ...updateCountryDto, updatedTime });
    return this.findOne(id, factNo);
  }

  async remove(id: string, factNo: string) {
    const result = await this.countryRepository.delete({ factNo, id });
    if (result.affected === 0) {
      throw new NotFoundException(`Country with ID ${id} not found.`);
    }
  }
}

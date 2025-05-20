import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { getUtcDate } from 'src/helpers/date';
import { PagingViewResponse } from 'src/views/pagingViewResponse';
import { FindOptionsWhere, Raw, Repository } from 'typeorm';
import { DATE_FORMAT_WHERE } from 'src/common/constants';

import { CreatePlannedSalesDto } from './dto/create-planned-sales.dto';
import { UpdatePlannedSalesDto } from './dto/update-planned-sales.dto';
import { PlannedSales } from './planned-sales.entity';
import { FilterPlannedSalesDto } from './dto/filter-planned-sales.dto';

@Injectable()
export class PlannedSalesService {
  constructor(
    @InjectRepository(PlannedSales)
    private readonly plannedSalesRepository: Repository<PlannedSales>,
  ) {}

  async findAll(filter: FilterPlannedSalesDto, factNo: string) {
    const { page, limit, keySort, typeSort, deptNo, planSale, createdBy, updatedBy, startDate, endDate } = filter;
    const currentPage = page && page > 0 ? page : 1;
    const pageLimit = limit && limit > 0 ? limit : 10;
    const offset = (currentPage - 1) * pageLimit;

    const where: FindOptionsWhere<PlannedSales> = { factNo };

    if (deptNo) {
      where.deptNo = deptNo;
    }

    if (startDate && endDate) {
      where.month = Raw(
        (alias) => `${alias} BETWEEN TO_DATE('${startDate}', '${DATE_FORMAT_WHERE}') AND TO_DATE('${endDate}', '${DATE_FORMAT_WHERE}')`,
      );
    }

    if (typeof planSale === 'number') {
      where.planSale = Raw((alias) => `${alias} = :planSale`, { planSale });
    }

    if (createdBy) {
      where.createdBy = createdBy;
    }

    if (updatedBy) {
      where.updatedBy = updatedBy;
    }

    const [result, total] = await this.plannedSalesRepository.findAndCount({
      where,
      order: {
        [keySort ?? 'month']: typeSort ?? 'DESC',
      },
      take: pageLimit,
      skip: offset,
    });

    if (!result.length) {
      return {
        page,
        limit,
        total,
        rows: [],
      };
    }

    return PagingViewResponse.from({ page, limit, total, rows: result });
  }

  async findOne(deptNo: string, month: Date, factNo: string) {
    const plannedSales = await this.plannedSalesRepository.findOne({
      where: {
        factNo,
        month: Raw((alias) => `TO_CHAR(${alias}, 'YYYY-MM') = :month`, { month: format(month, 'yyyy-MM') }),
        deptNo,
      },
    });
    if (!plannedSales) {
      throw new NotFoundException(`PlannedSales with deptNo ${deptNo}, factNo ${factNo}, and month not found`);
    }
    return plannedSales;
  }

  async create(createPlannedSalesDto: CreatePlannedSalesDto, factNo: string): Promise<PlannedSales> {
    const createdTime = getUtcDate();

    await this.plannedSalesRepository
      .createQueryBuilder()
      .insert()
      .into(PlannedSales)
      .values({
        ...createPlannedSalesDto,
        factNo,
        createdTime,
        updatedTime: createdTime,
        month: () => `TO_DATE(:month, 'YYYY-MM')`,
      })
      .setParameter('month', format(new Date(createPlannedSalesDto.month), 'yyyy-MM'))
      .execute();

    // Lấy record vừa tạo
    return this.findOne(createPlannedSalesDto.deptNo, new Date(createPlannedSalesDto.month), factNo);
  }

  async update(deptNo: string, month: Date, factNo: string, updatePlannedSalesDto: Partial<UpdatePlannedSalesDto>) {
    const updatedTime = getUtcDate();
    await this.plannedSalesRepository.update(
      {
        deptNo,
        factNo,
        month: Raw((alias) => `TO_CHAR(${alias}, 'YYYY-MM') = :month`, { month: format(month, 'yyyy-MM') }),
      },
      { ...updatePlannedSalesDto, updatedTime },
    );

    return this.findOne(deptNo, month, factNo);
  }

  async remove(deptNo: string, month: Date, factNo: string) {
    const result = await this.plannedSalesRepository.delete({
      factNo,
      deptNo,
      month: Raw((alias) => `${alias} = TO_DATE(:month, 'YYYY-MM')`, {
        month: format(month, 'yyyy-MM'),
      }),
    });
    if (result.affected === 0) {
      throw new NotFoundException(`PlannedSales with deptNo ${deptNo}, factNo ${factNo}, and month not found`);
    }
  }
}

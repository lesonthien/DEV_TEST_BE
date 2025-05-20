import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getUtcDate } from 'src/helpers/date';
import { getOrder } from 'src/helpers/order';
import { PagingViewResponse } from 'src/views/pagingViewResponse';
import { FindOptionsWhere, Raw, Repository } from 'typeorm';

import { Dept } from './dept.entity';
import { CreateDeptDto } from './dto/create-dept.dto';
import { FilteDeptDto } from './dto/fillter-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(Dept)
    private readonly deptRepository: Repository<Dept>,
  ) {}

  async findAll(filter: FilteDeptDto, factNo: string, branchNo: string) {
    const { page, limit, keySort, typeSort, id, deptName, use, dateStop, createdBy, createdTime, updatedBy } = filter;
    const currentPage = page && page > 0 ? page : 1;
    const pageLimit = limit && limit > 0 ? limit : 10;
    const offset = (currentPage - 1) * pageLimit;
    const where: FindOptionsWhere<Dept> = { factNo, branchNo };

    if (id) {
      where.id = Raw((alias) => `LOWER(${alias}) LIKE '%${id.toLowerCase()}%'`);
    }

    if (deptName) {
      where.deptName = Raw((alias) => `LOWER(${alias}) LIKE '%${deptName.toLowerCase()}%'`);
    }

    if (use) {
      where.use = use;
    }

    if (dateStop) {
      where.dateStop = dateStop;
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
    const order = getOrder({ keySort, typeSort });
    const [result, total] = await this.deptRepository.findAndCount({
      where,
      order,
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

    return PagingViewResponse.from({ page, limit, total, rows: result });
  }

  async findOne(id: string, branchNo: string, factNo: string) {
    const dept = await this.deptRepository.findOne({
      where: { id, branchNo, factNo },
    });

    if (!dept) {
      return null;
    }

    return dept;
  }

  async create(createDeptDto: CreateDeptDto, factNo: string, branchNo: string): Promise<Dept> {
    const createdTime = getUtcDate();
    const dept = this.deptRepository.create({ ...createDeptDto, factNo, branchNo, createdTime, updatedTime: createdTime });

    return this.deptRepository.save(dept);
  }

  async update(id: string, branchNo: string, factNo: string, updateDeptDto: Partial<UpdateDeptDto>) {
    const updatedTime = getUtcDate();
    await this.deptRepository.update({ id, factNo }, { ...updateDeptDto, updatedTime });
    return this.findOne(id, branchNo, factNo);
  }

  async remove(id: string, branchNo: string, factNo: string) {
    const result = await this.deptRepository.delete({ id, branchNo, factNo });
    if (result.affected === 0) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
  }
}

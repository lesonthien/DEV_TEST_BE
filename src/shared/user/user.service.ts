/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable import/no-extraneous-dependencies */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import md5 from 'md5';
import { I18nService } from 'nestjs-i18n';
import { JwtPayload } from 'src/auth/auth.interface';
import { PermissionApi } from 'src/common/constants';
import { CustomException } from 'src/common/exception/record-not-found.exception';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { PagingViewResponse } from 'src/views/pagingViewResponse';
import { UserViewResponse } from 'src/views/user/userViewResponse';
import { Equal, FindOptionsWhere, Like, Not, Repository } from 'typeorm';

import { ChangePasswordInput } from './dto/change-password.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordInput } from './dto/reset-password.dto';
import { UserEntity } from './user.entity';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  public async fetch(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: [{ username }],
    });

    if (!user) {
      throw new BadRequestException('username or password incorrect');
    }

    return user;
  }

  public async findUserByEmailOrPhone(email: string, phone: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: [{ email }, { phone }],
    });
  }

  public async registerUser(input: RegisterDto) {
    await this.checkUsername(input.username, input.factNo);
    await this.checkEmailAndFact(input.email, input.factNo);

    if (input.phoneNumber) await this.checkPhone(input.phoneNumber);

    const passwordHash = md5(input.password).toUpperCase();
    const createData = {
      id: input.username,
      fullname: [input.firstName, input.lastName].join(' ').trim(),
      password: passwordHash,
      username: input.username,
      email: input.email,
      phone: input.phoneNumber,
      // @TODO: Replace value user data
      state: 1,
      role: input.role,
      factNo: input.factNo,
    };

    const userRecord = this.userRepository.create(createData);

    return this.userRepository.save(userRecord);
  }

  // updateUser(input: UpdateUserDto, user: any) {
  //   return true;
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getUserInfo(user: User) {
    const userInfo = await this.userRepository.findOneBy({ id: user.id });
    const { password, ...userInfoWithoutPassword } = userInfo ?? {};
    return {
      ...userInfoWithoutPassword,
      permissions: [],
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async changePassword(input: ChangePasswordInput, user: any) {
    const userRecord = await this.userRepository.findOneBy({
      id: user.id,
    });

    const oldPassword = md5(input.oldPassword);
    if (oldPassword !== userRecord?.password) {
      throw new BadRequestException('password was wrong');
    }

    const newPassword = md5(input.password);
    return this.userRepository.update({ id: user.id }, { password: newPassword });
  }

  async checkUsername(username: string, factNo: string) {
    const isExits = (await this.userRepository.count({ where: { username: Equal(username), factNo: Equal(factNo) } })) > 0;

    if (isExits) {
      throw new CustomException('username already exist');
    }

    return isExits;
  }

  async checkEmailAndFact(email: string, factNo: string) {
    const isExits = (await this.userRepository.count({ where: { email: Like(email), factNo: Equal(factNo) } })) > 0;
    if (isExits) {
      throw new CustomException('email already exist');
    }
    return isExits;
  }

  async checkEmail(email: string) {
    const isExits = (await this.userRepository.count({ where: { email: Like(email) } })) > 0;
    if (isExits) {
      throw new CustomException('email already exist');
    }
    return isExits;
  }

  async checkPhone(phone: string) {
    const isExits = (await this.userRepository.count({ where: { phone: Like(phone) } })) > 0;
    if (isExits) {
      throw new CustomException('phone already exist');
    }

    return isExits;
  }

  async getUsers(input: FilterUserDto, user?: JwtPayload): Promise<PagingViewResponse<UserViewResponse>> {
    const where: FindOptionsWhere<UserEntity> = {};
    if (input.name) {
      where.fullname = Like(`%${input.name}%`);
    }

    if (user?.role !== PermissionApi.SUPPER_ADMIN) {
      where.role = Not(PermissionApi.SUPPER_ADMIN);
    }

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    if (user?.factNo && (user.role as PermissionApi) !== PermissionApi.SUPPER_ADMIN) {
      where.factNo = Equal(user.factNo);
    }

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roleInfo', 'role') // Liên kết với Role
      .where(where)
      .skip((input.page - 1) * input.limit)
      .take(input.limit);

    if (input.keySort && input.typeSort) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      queryBuilder.orderBy(input.keySort, input.typeSort as 'ASC' | 'DESC');
    }

    const response = await queryBuilder.getManyAndCount();
    const users = response[0].map((item) => UserViewResponse.from(item));

    return PagingViewResponse.from({ limit: input.limit, page: input.page, rows: users, total: response[1] });
  }

  async resetPassword(input: ResetPasswordInput) {
    const userRecord = await this.userRepository.findOneBy({
      id: input.user_id,
    });
    if (!userRecord) {
      throw new BadRequestException('not found user');
    }

    const newPassword = md5(input.password);
    return this.userRepository.update({ id: input.user_id }, { password: newPassword });
  }

  async getTracks(asFactNo: string, asDateS: string, asDateE: string): Promise<unknown> {
    return this.userRepository.query(
      `SELECT SUBSTR(T.TRACK_DATE,7,2)||'/'||SUBSTR(T.TRACK_DATE,5,2)||'/'||SUBSTR(T.TRACK_DATE,1,4)  TRACK_DATE,
             T.TRACK_NO, T.USER_NO,
             SUBSTR(T.ENTRY_TIME,7,2)||'/'||SUBSTR(T.ENTRY_TIME,5,2)||'/'||SUBSTR(T.ENTRY_TIME,1,4)||' '||SUBSTR(T.ENTRY_TIME,9,2)||':'||SUBSTR(T.ENTRY_TIME,11,2)||':'||SUBSTR(T.ENTRY_TIME,13,2) ENTRY_TIME,
             SUBSTR(T.EXIT_TIME,7,2)||'/'||SUBSTR(T.EXIT_TIME,5,2)||'/'||SUBSTR(T.EXIT_TIME,1,4)||' '||SUBSTR(T.EXIT_TIME,9,2)||':'||SUBSTR(T.EXIT_TIME,11,2)||':'||SUBSTR(T.EXIT_TIME,13,2) EXIT_TIME,
             T.LOGIN_IP, T.PC_NAME, T.OS_USER, USERS.USER_NM,
             DECODE(SUBSTR(TRIM(USERS.DEPT_NO),1,2),'ND','Noi Dia','CA','Chau A','DD','DUONG DAI','CN','CHI NHANH','SD','SALE DOAN','AD','ADMIN','IB','SALE DOAN INBOUND','OB','NGOAI NUOC',SUBSTR(TRIM(USERS.DEPT_NO),1,2)) BO_PHAN,
             DECODE(USERS.DEPT_NM,'1','NHAN VIEN','2','Nhân Viên Điều Hành','3','Nhân Viên Quản Lý(Sale)','4','Quản Trị Khối','5','Giám Đốc') Chuc_vu
        FROM TRACK_M t, USERS
       WHERE T.USER_NO = USERS.USER_NO
         AND T.FACT_NO = :asFactNo
         AND T.TRACK_DATE BETWEEN to_date(:asDateS, 'yyyymmdd') AND to_date(:asDateE, 'yyyymmdd')`,
      [asFactNo, asDateS, asDateE],
    );
  }
}

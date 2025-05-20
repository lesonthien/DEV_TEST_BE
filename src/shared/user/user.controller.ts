/* eslint-disable import/no-extraneous-dependencies */
import { Body, Controller, Get, Post, Put, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public, ReqUser } from 'src/common';
import { RequestContext } from 'src/common/input/request';
import { User, UserService } from 'src/shared/user';
import { ChangePasswordInput } from 'src/shared/user/dto/change-password.dto';
import { CheckUserInput } from 'src/shared/user/dto/check-user.dto';
import { FilterUserDto } from 'src/shared/user/dto/filter-user.dto';
import { ResetPasswordInput } from 'src/shared/user/dto/reset-password.dto';

import { RegisterDto } from './dto/register.dto';

@ApiTags('System Settings - Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @ApiOperation({ summary: 'Update user info' })
  // @Put()
  // async updateUser(@Body() input: UpdateUserDto, @ReqUser() user: User) {
  //   return this.userService.updateUser(input, user);
  // }

  @Public()
  @Post('create')
  public register(@Body() input: RegisterDto) {
    return this.userService.registerUser(input);
  }

  @Get('my-profile')
  async getUserInfo(@ReqUser() user: User) {
    return this.userService.getUserInfo(user);
  }

  @Put('change-password')
  async changePassword(@Body() input: ChangePasswordInput, @ReqUser() user: User) {
    return this.userService.changePassword(input, user);
  }

  @Get()
  async getUsers(@Query() input: FilterUserDto, @Req() req: RequestContext) {
    return this.userService.getUsers(input, req.user);
  }

  @Put('reset-password')
  async resetPassword(@Body() input: ResetPasswordInput) {
    return this.userService.resetPassword(input);
  }

  @Public()
  @Post('check')
  async checkEmailPhone(@Body() input: CheckUserInput) {
    let isValid = false;
    if (input.email) {
      isValid = !(await this.userService.checkEmail(input.email));
    }
    if (input.phone) {
      isValid = !(await this.userService.checkPhone(input.phone));
    }
    return { isValid, message: 'ok' };
  }
}

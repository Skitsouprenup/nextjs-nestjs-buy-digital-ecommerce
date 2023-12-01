import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Res,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import TrInterceptData from '../types/TrInterceptData';
import { Roles } from 'src/shared/decorators/role.decorator';
import { UserRoles } from 'src/shared/schema/users';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Create Account
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginInfo: { email: string; password: string },
    //@Res({ passthrough: true }) res: Response,
  ) {
    const loginResponse: TrInterceptData = await this.usersService.login(
      loginInfo.email,
      loginInfo.password,
    );

    /*
      if (loginResponse.success) {
        const currentTime = new Date().getTime();

        res.cookie('authtoken', loginResponse.content?.token, {
          httpOnly: true,
          domain: 'http://localhost:4000',
          secure: true,
          expires: new Date(currentTime + 1000 * 60 * 60),
        });
      }
      //Don't include the token when the response is gonna be sent
      //to a client
      delete loginResponse.content?.token;
    */

    return loginResponse;
  }

  //Get users by type
  @Get('?')
  @Roles(UserRoles.ADMIN)
  async findAll(@Query('type') type: string) {
    const users = await this.usersService.findAll(type);

    return {
      success: true,
      message: '',
      content: users,
    };
  }

  /*
    Not necessary to be used because in recent updates
    JWT token is not in http cookie anymore
  */
  @Get('logout')
  logout(@Res() res: Response) {
    //res.clearCookie('authtoken');
    return res.status(200).json({
      success: true,
      message: 'Logout Successful',
    });
  }

  @Get('activate/:otp/:email')
  async activateAccount(
    @Param('otp') otp: string,
    @Param('email') email: string,
  ) {
    return await this.usersService.activateAccount(otp, email);
  }

  @Get('otp/resend/:email')
  async resendOtp(@Param('email') email: string) {
    return await this.usersService.resendOtp(email);
  }

  @Get('password/reset/:email')
  async requestResetPassword(@Param('email') email: string) {
    return await this.usersService.requestResetPassword(email);
  }

  @Patch('password/reset?')
  async resetPassword(
    @Query('email') email: string,
    @Query('otp') otp: string,
  ) {
    return await this.usersService.resetPassword(email, otp);
  }

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return await this.usersService.findUserById(id);
  }

  @Put(':id')
  async updateUserDetails(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUserDetails(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

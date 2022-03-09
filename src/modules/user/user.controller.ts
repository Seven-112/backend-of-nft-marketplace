import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { Public } from 'src/guard/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { GetUserInformationDTO } from './DTO/get-user-information';
import { UpdateUserDTO } from './DTO/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch('/update')
  @UsePipes(new ValidationPipe())
  async update(@Req() request: any, @Body() body: UpdateUserDTO) {
    const isWalletAvailable = await this.userService.isWalletAvailable(
      body.walletAddress,
    );

    if (!isWalletAvailable) {
      return {
        code: 401,
        message: 'Wallet not avaiable',
      };
    }

    const user = await this.userService.updateUser(
      request.user.sub,
      body.walletAddress,
    );

    return {
      code: 200,
      message: '',
      data: user,
    };
  }

  @Public()
  @Get('/test')
  async test() {
    this.userService.test();
    return {};
  }

  @Post('/info')
  @UsePipes(new ValidationPipe())
  async getUserInformation(@Body() body: GetUserInformationDTO) {
    const users = await this.userService.getUsers(body.userIds);

    return {
      code: 200,
      data: {
        users,
      },
    };
  }

  @Get('/:walletAddress')
  async getByWalletAddress(@Param('walletAddress') walletAddress: string) {
    const user = await this.userService.getByWalletAddress(walletAddress);

    if (!user.count) {
      return {
        code: 401,
        message: 'User not found',
      };
    }

    return {
      code: 200,
      message: '',
      data: user[0],
    };
  }
}

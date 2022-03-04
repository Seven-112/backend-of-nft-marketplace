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
import { Request } from 'express';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CreateUserDTO } from './DTO/create-user.dto';
import { UpdateUserDTO } from './DTO/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create')
  @UsePipes(new ValidationPipe())
  async create(@Req() request: any, @Body() body: CreateUserDTO) {
    const isWalletAvailable = await this.userService.isWalletAvailable(
      body.walletAddress,
    );

    if (!isWalletAvailable) {
      return {
        code: 401,
        message: 'Wallet not avaiable',
      };
    }

    const isUserAvailable = await this.userService.isUserAvailable(
      request.user.sub,
    );

    if (!isUserAvailable) {
      return {
        code: 401,
        message: 'User not avaiable',
      };
    }

    const user = await this.userService.createUser({
      id: request.user.sub,
      walletAddress: body.walletAddress,
    });

    return {
      code: 200,
      message: '',
      data: user,
    };
  }

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

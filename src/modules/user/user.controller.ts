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
import { AnyDocument } from 'dynamoose/dist/Document';
import { UserModel } from 'src/common/model';
import { Public } from 'src/guard/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { GetUserInformationDTO } from './DTO/get-user-information';
import { SearchUserDTO } from './DTO/search-user.dto';
import { UpdateProfileDTO } from './DTO/update-profile';
import { UpdateUserDTO } from './DTO/update-user.dto';
import { UserService } from './user.service';
import { User, UserRole } from './user.interface';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/profile')
  async getUserProfile(@Req() request: any) {
    const user = await this.userService.getUserById(request.user.sub);

    return {
      code: 200,
      message: '',
      data: {
        ...user,
        sub: request.user.sub,
      },
    };
  }

  @Get('/profile/cognito')
  async getUserProfileFromCognito(@Req() request: Request) {
    const accessToken = request.headers.authorization.split(' ')[1];

    const data = await this.userService.getUserFromCognito(accessToken);

    return {
      code: 200,
      message: 'Get user success',
      data,
    };
  }

  @Patch('/profile')
  @UsePipes(new ValidationPipe())
  async updateProfile(
    @Req() request: AnyDocument,
    @Body() body: UpdateProfileDTO,
  ) {
    const user = await this.userService.getUserById(request.user.sub);

    if (!user) {
      return {
        code: 404,
        message: 'User not found',
        data: null,
      };
    }

    const isValidUsername = await this.userService.getUserByUsername(
      body.username,
    );

    if (
      isValidUsername.count &&
      isValidUsername[0].username !== user.username
    ) {
      return {
        code: 409,
        message: 'Username is already taken',
        data: null,
      };
    }

    Object.assign(user, body);

    const updatedUser = await this.userService.updateUser(user);

    return {
      code: 200,
      message: 'Updated',
      data: updatedUser,
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

    const bodyWithRole = {
      ...body,
      role: UserRole.User,
    };

    const updatedUser = await this.userService.updateWalletAddress(
      request.user.sub,
      bodyWithRole,
    );

    return {
      code: 200,
      message: '',
      data: updatedUser,
    };
  }

  // @Public()
  // @Get('/test')
  // async test() {
  //   this.userService.test();
  //   return {};
  // }

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

  @Get('/id/:id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);

    if (user) {
      return {
        code: 200,
        data: user,
      };
    }

    return {
      code: 404,
      message: 'User not found',
      data: null,
    };
  }

  @Post('/search')
  @Public()
  @UsePipes(new ValidationPipe())
  async search(@Body() body: SearchUserDTO) {
    const users = await this.userService.searchUsers(body.address);

    if (!users.count) {
      return {
        code: 404,
        message: 'User not found',
        data: null,
      };
    }

    return {
      code: 200,
      message: '',
      data: users,
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

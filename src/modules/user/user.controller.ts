import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AnyDocument } from 'dynamoose/dist/Document';
import { JwtAuthGuard, Public } from 'src/guard/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { GetUserInformationDTO } from './DTO/get-user-information';
import { SearchUserDTO } from './DTO/search-user.dto';
import {
  UpdatePasswordDTO,
  UpdateProfileDTO,
  UpdateSocialDTO,
} from './DTO/update-profile';
import { UpdateUserDTO } from './DTO/update-user.dto';
import { UserService } from './user.service';
import { Social, UserRole, UserStatus } from './user.interface';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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

  @Patch('/socials')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async updateSocial(@Req() request: any, @Body() body: UpdateSocialDTO) {
    let user = await this.userService.getUserById(request.user.sub);

    if (!user) {
      return {
        code: 404,
        message: 'User not found',
        data: null,
      };
    }

    Object.assign(user, body);

    user = await this.userService.updateUser(user);

    return {
      code: 200,
      message: 'Updated',
      data: user,
    };
  }

  @Patch('/password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async updatePassword(
    @Req() request: AnyDocument,
    @Body() body: UpdatePasswordDTO,
  ) {
    try {
      const accessToken = request.headers.authorization.split(' ')[1];

      await this.userService.changePassword({
        AccessToken: accessToken,
        PreviousPassword: body.oldPassword,
        ProposedPassword: body.newPassword,
      });

      return {
        code: 201,
        message: 'Password updated',
      };
    } catch (error) {
      console.log('err', error);
      return {
        code: error.statusCode,
        message: error.code,
      };
    }
  }

  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async update(@Req() request: any, @Body() body: UpdateUserDTO) {
    const userByEmail = await this.userService.getByEmail(body.email.toLowerCase());
    const userByWallet = await this.userService.getByWalletAddress(
      body.walletAddress,
    );
    const case1 =
      userByWallet?.[0]?.email === body.email &&
      userByWallet?.[0]?.walletAddress === body.walletAddress;

    // wallet and email not in db
    const case2 = !userByWallet.count && !userByEmail?.[0]?.walletAddress;

    if (case1 || case2) {
      const foundUser = await this.userService.getUserById(request.user.sub);
      
      const updatedBody = {
        ...body,
        email: body.email.toLowerCase(),
        role: foundUser?.role || UserRole.User,
        status: foundUser?.status || UserStatus.active,
        createdAt: foundUser?.createdAt || new Date().toISOString(),
      };

      if(updatedBody.status === UserStatus.inactive) {
        await this.userService.disableUserCognito(updatedBody.email, request.user.sub)
      }

      if(updatedBody.status === UserStatus.active && foundUser.status !== UserStatus.active) {
        await this.userService.enableUserCognito(updatedBody.email, request.user.sub)
      }

      const updatedUser = await this.userService.updateWalletAddress(
        request.user.sub,
        updatedBody,
      );
      
      return {
        code: 200,
        message: '',
        data: updatedUser,
      };
    }

    return {
      code: 400,
      message: 'Cannot update wallet',
      data: null,
    };
  }

  @Patch('/admin/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateUser(@Req() request: AnyDocument, @Body() body: any) {
    const user = await this.userService.getUserById(request.user.sub);

    if (!user)
      return {
        code: 404,
        message: 'User not found',
        data: null,
      };

    if (user.role !== UserRole.Admin)
      return {
        code: 403,
        message: 'Not allowed',
        data: null,
      };

    const updatedUser = await this.userService.updateUser(body);

    return {
      code: 200,
      message: 'Updated',
      data: updatedUser,
    };
  }

  @Get('/admin/accounts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAllAccounts(
    @Req() request: AnyDocument,
    @Query('limit') limit?: number,
  ) {
    const user = await this.userService.getUserById(request.user.sub);

    if (user.role !== UserRole.Admin)
      return {
        code: 403,
        message: 'Not allowed',
        data: null,
      };

    const allAccounts = await this.userService.getAllUsers(limit);

    return {
      code: 200,
      data: { accounts: allAccounts, length: allAccounts.length },
    };
  }

  // @Public()
  // @Get('/test')
  // async test() {
  //   this.userService.test();
  //   return {};
  // }

  @Post('/info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserByIdOrWallet(id);
    if(!user.length) {
      return {
        code: 404,
        message: 'User not found',
        data: null,
      };
    }
    return {
      code: 200,
      data: user[0],
    };
  }

  @Post('/search')
  @Public()
  @UsePipes(new ValidationPipe())
  async search(@Body() body: SearchUserDTO) {
    const users = await this.userService.searchUsers(body.address);

    return {
      code: 200,
      message: 'successful',
      data: users,
    };
  }

  @Get('/:walletAddress')
  @Public()
  async getByWalletAddress(@Param('walletAddress') walletAddress: string) {
    const user = await this.userService.getByWalletAddress(walletAddress);

    if (!user.count) {
      return {
        code: 404,
        message: 'User not found',
        data: null,
      };
    }

    return {
      code: 200,
      message: '',
      data: user[0],
    };
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    let user = await (await this.userService.getUserByIdOrWallet(id))['toJSON']();
    if(!user.length) {
      return {
        code: 404,
        message: 'User not found',
        data: null,
      };
    }

    user = user[0];
    user.deletedAt = new Date().getTime();
    await this.userService.updateUser(user);
    await this.userService.disableUserCognito(user.email, user.id);
    return {
      code: 200,
      data: user[0],
    };
  }
}

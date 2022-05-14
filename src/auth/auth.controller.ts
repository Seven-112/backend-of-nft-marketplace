import {
  Body,
  ConflictException,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  Controller,
  Get,
  Req,
  UsePipes,
  BadRequestException,
  ForbiddenException,
  UseGuards,
  Res,
  Redirect,
  Query,
} from '@nestjs/common';
import { Auth } from 'aws-amplify';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { RegisterDTO } from './DTO/register.dto';
import { UserService } from 'src/modules/user/user.service';
import { User, UserStatus } from 'src/modules/user/user.interface';
import { Public } from 'src/guard/jwt-auth.guard';
import { LoginDTO } from './DTO/login.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { WalletVerifyDTO } from './DTO/walletVerify.dto';
import {
  ForgotPasswordDTO,
  VerifyOtpDTO,
  UpdatePasswordDTO,
} from './DTO/forgotPassword.dto';
import { MailService } from 'src/modules/mail/mail.service';
import { ResetPasswordDTO } from './DTO/resetPassword.dto';
import { RedisService } from 'src/modules/redis/redis.service';
import { LoginGoogleDTO } from './DTO/loginGoogle.dto';
import { JwtResponse } from './auth.interface';
import { TwitterGuard } from './twitter.guard';
import { CheckCanLoginDTO } from './DTO/check-can-login.DTO';
import { CheckUsernameDTO } from './DTO/check-username.DTO';
import { CheckEmailDTO } from './DTO/check-email.DTO';
import { CheckCanAuthDto } from './DTO/check-can-auth.DTO';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService, // private readonly redisCacheService: RedisCacheService,
    private readonly redisService: RedisService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/check-can-auth')
  @UsePipes(new ValidationPipe())
  @Public()
  async checkCanAuth(@Body() dto: CheckCanAuthDto) {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user.count) {
      return {
        code: 400,
        message: 'user_not_found',
      };
    }

    if (dto.isGoogle === user[0].isGoogle || user[0].isGoogle === undefined) {
      return {
        code: 200,
        message: 'can_auth',
      };
    }

    return {
      code: 400,
      message: 'user_is_registered_by_another_provider',
    };
  }

  @Post('/canLogin')
  @UsePipes(new ValidationPipe())
  @Public()
  async canLogin(@Body() body: CheckCanLoginDTO, @Query('type') type?: string) {
    let userByEmail = (await this.userService.getByEmail(body.email)) as any;
    let userByWallet = (await this.userService.getByWalletAddress(
      body.walletAddress,
    )) as any;

    userByEmail = userByEmail.length ? userByEmail[0] : null;
    userByWallet = userByWallet.length ? userByWallet[0] : null;

    if (userByEmail?.status !== UserStatus.active) {
      return {
        code: 400,
        message: 'user_not_active',
      };
    }

    if (userByEmail?.deletedAt) {
      return {
        code: 400,
        message: 'user_is_deleted',
      };
    }

    if (
      (userByEmail?.walletAddress === body?.walletAddress &&
        userByWallet?.email === body?.email) ||
      (!userByEmail?.walletAddress && !userByWallet)
    ) {
      return {
        code: 200,
        message: 'can_login',
      };
    }

    if (type === 'emailFirst') {
      if (userByEmail?.walletAddress !== body?.walletAddress && !userByWallet) {
        return {
          code: 400,
          message: 'user_and_wallet_not_mapping_and_wallet_not_connected',
        };
      }

      if (userByWallet?.email !== body.email) {
        return {
          code: 400,
          message: 'email_and_wallet_not_mapping',
        };
      }

      if (userByEmail.walletAddress !== body.walletAddress && userByWallet) {
        return {
          code: 400,
          message: 'user_and_wallet_not_mapping_and_wallet_connected',
        };
      }
    }

    if (type === 'walletFirst') {
      if (userByWallet?.email !== body.email && !userByEmail) {
        return {
          code: 400,
          message:
            'user_and_wallet_not_mapping_and_email_not_connected_with_wallet',
        };
      }

      if (userByEmail?.walletAddress !== body.walletAddress) {
        return {
          code: 400,
          message: 'wallet_and_user_not_mapping',
        };
      }

      if (userByWallet?.email !== body.email && userByEmail) {
        return {
          code: 400,
          message:
            'user_and_wallet_not_mapping_and_email_connected_with_wallet',
        };
      }
    }

    return {
      code: 200,
      message: 'can_login',
    };
  }

  @Post('/check-username')
  @UsePipes(new ValidationPipe())
  @Public()
  async checkUsername(@Body() body: CheckUsernameDTO) {
    const user = await this.userService.getUserByUsername(body.username);

    if (user.length) {
      return {
        code: 400,
        message: 'username_is_existed',
      };
    }

    return {
      code: 200,
      message: 'successful',
    };
  }

  @Post('/check-email')
  @UsePipes(new ValidationPipe())
  @Public()
  async checkEmail(@Body() body: CheckEmailDTO) {
    const user = await this.userService.getUserByEmail(body.email);

    if (user.length) {
      return {
        code: 400,
        message: 'username_is_existed',
      };
    }

    return {
      code: 200,
      message: 'successful',
    };
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @HttpCode(HttpStatus.OK)
  @Public()
  @UsePipes(new ValidationPipe())
  async register(@Body() body: RegisterDTO) {
    try {
      // const isEmailAvailable = await this.userService.isEmailAvailable(
      //   body.email,
      // );
      // if (!isEmailAvailable) {
      //   throw new ConflictException('Email is not available');
      // }
      // const password = await this.userService.hashPassword(body.password);
      // const user = new User({
      //   email: body.email,
      //   password,
      // });
      // // register user
      // const registeredUser = await this.userService.create(user);
      // Reflect.deleteProperty(registeredUser, 'password');
      // return registeredUser;

      await Auth.signUp(body.email, body.password);
      return {
        code: HttpStatus.CREATED,
        message: 'User created',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @Public()
  @UsePipes(new ValidationPipe())
  async login(@Body() body: LoginDTO) {
    try {
      // const user = await this.userService.getUserByEmail(body.email);
      // if (!user) {
      //   throw new NotFoundException('User not found!');
      // }
      // const isValidPassword = await bcrypt.compare(
      //   body.password,
      //   user.password,
      // );
      // if (!isValidPassword) {
      //   throw new UnauthorizedException();
      // }

      // return this.authService.login(user);

      const response = await Auth.signIn(body.email, body.password);

      return {
        code: HttpStatus.OK,
        accessToken: response.signInUserSession.accessToken.jwtToken,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/forgot-password')
  @HttpCode(HttpStatus.OK)
  @Public()
  async forgotPassword(@Body() body: ForgotPasswordDTO) {
    try {
      const email = body.email;
      const user = await this.userService.getUserByEmail(email);
      if (!user[0]) {
        throw new NotFoundException('User not found!');
      }

      const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      const token = this.authService.hashEmailAndOtp(email, otp);
      this.mailService.sendForgotPasswordEmail(email, otp);

      return { token };
    } catch (error) {
      throw error;
    }
  }

  @Post('/verify-otp')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  async verifyOtp(@Body() body: VerifyOtpDTO) {
    try {
      const { token, otp } = body;
      try {
        const decoded: JwtResponse = this.authService.verifyOtp(token);
        if (!otp || String(decoded.otp) !== String(otp)) {
          throw new BadRequestException('Invalid OTP!');
        }
        return;
      } catch (error) {
        throw new BadRequestException('Token expired!');
      }
    } catch (error) {
      throw error;
    }
  }

  @Post('/update-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  async updatePassword(@Body() body: UpdatePasswordDTO) {
    try {
      const { email, password } = body;
      const data = await this.authService.updatePassword(email, password);
      return data;
    } catch (error) {
      throw error;
    }
  }

  // @Post('/reset-password')
  // @HttpCode(HttpStatus.OK)
  // @Public()
  // async resetPassword(@Body() body: ResetPasswordDTO) {
  //   try {
  //     const user = await this.userService.getUserByEmail(body.email);
  //     if (!user) {
  //       throw new NotFoundException('User not found!');
  //     }
  //     // const otp = await this.redisCacheService.get(body.email);
  //     // if (!otp) {
  //     //   throw new ForbiddenException('OTP expired!');
  //     // }
  //     // if (otp !== body.otp) {
  //     //   throw new ForbiddenException('Invalid OTP');
  //     // }

  //     const password = await this.userService.hashPassword(body.password);
  //     const updated = await this.userService.updatePassword(user.id, password);
  //     // await this.redisCacheService.del(user.email);

  //     return updated;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @Get('/twitter')
  // @UseGuards(TwitterGuard)
  // async twitterAuth() {}

  // @Get('/twitter/callback')
  // @UseGuards(TwitterGuard)
  // @Redirect('http://localhost:3000', 302)
  // async twitterGuardRedirect(@Req() req: any) {
  //   console.log(req);
  // }
}

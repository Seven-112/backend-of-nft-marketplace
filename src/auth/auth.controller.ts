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
} from '@nestjs/common';
import { Auth } from 'aws-amplify';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { RegisterDTO } from './DTO/register.dto';
import { UserService } from 'src/modules/user/user.service';
import {
  RequestWithUser,
  User,
  UserType,
} from 'src/modules/user/user.interface';
import { Public } from 'src/guard/jwt-auth.guard';
import { LoginDTO } from './DTO/login.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { WalletService } from 'src/modules/wallet/wallet.service';
import { WalletVerifyDTO } from './DTO/walletVerify.dto';
import { ForgotPasswordDTO } from './DTO/forgotPassword.dto';
import { MailService } from 'src/modules/mail/mail.service';
import { ResetPasswordDTO } from './DTO/resetPassword.dto';
import { RedisCacheService } from 'src/modules/redisCache/redisCache.service';
import { LoginGoogleDTO } from './DTO/loginGoogle.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly walletService: WalletService,
    private readonly mailService: MailService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

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

      const response = await Auth.signUp(body.email, body.password);
      return {
        code: HttpStatus.CREATED,
        message: 'User created',
      };
    } catch (error: any) {
      return {
        code: HttpStatus.OK,
        message: error.message,
        errorCode: error.code,
      };
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
      return {
        code: HttpStatus.OK,
        message: error.message,
        errorCode: error.code,
      };
    }
  }

  @Post('/login/google')
  @HttpCode(HttpStatus.OK)
  @Public()
  @UsePipes(new ValidationPipe())
  async loginGoogle(@Body() body: LoginGoogleDTO) {
    try {
      const info = await this.authService.getTokenInfo(body.token);
      const user = await this.userService.getUserByEmail(info.email);
      if (user) {
        // return this.authService.login(user);
        return;
      }
      const newUser = new User({
        email: info.email,
        firstName: body.firstName,
        lastName: body.lastName,
        type: UserType.google,
        social: {
          googleId: body.googleId,
        },
      });
      const registeredUser = await this.userService.create(newUser);

      // return this.authService.login(registeredUser);
      return;
    } catch (error) {
      if (error?.response?.data?.error === 'invalid_token') {
        throw new ForbiddenException('Invalid token');
      }

      throw error;
    }
  }

  @Get('/isAuthenticated')
  @HttpCode(HttpStatus.OK)
  async isAuthenticated(@Req() req: RequestWithUser) {
    try {
      Reflect.deleteProperty(req.user, 'password');
      return req.user;
    } catch (error) {
      throw error;
    }
  }

  @Post('/forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  async forgotPassword(@Body() body: ForgotPasswordDTO) {
    try {
      const user = await this.userService.getUserByEmail(body.email);
      if (!user) {
        throw new NotFoundException('User not found!');
      }

      return this.mailService.sendForgotPasswordEmail(user);
    } catch (error) {
      throw error;
    }
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  @Public()
  async resetPassword(@Body() body: ResetPasswordDTO) {
    try {
      const user = await this.userService.getUserByEmail(body.email);
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      const otp = await this.redisCacheService.get(body.email);
      if (!otp) {
        throw new ForbiddenException('OTP expired!');
      }
      if (otp !== body.otp) {
        throw new ForbiddenException('Invalid OTP');
      }

      const password = await this.userService.hashPassword(body.password);
      const updated = await this.userService.updatePassword(user.id, password);
      await this.redisCacheService.del(user.email);

      return updated;
    } catch (error) {
      throw error;
    }
  }

  @Get('/wallet/request')
  @HttpCode(HttpStatus.OK)
  @Public()
  async walletRequest() {
    return this.walletService.generateKey();
  }

  @Post('/wallet/verify')
  @HttpCode(HttpStatus.OK)
  @Public()
  async walletVerify(@Body() body: WalletVerifyDTO) {
    try {
      const isValid = await this.walletService.verifyKey(
        body.key,
        body.iv,
        body.publicKey,
        body.sign,
      );
      if (!isValid) {
        throw new BadRequestException();
      }
      const wallet = await this.walletService.findByWalletAddress(
        body.publicKey,
      );
      if (!wallet.count) {
        throw new NotFoundException();
      }
      const userId = wallet?.[0]?.userId;
      const user = await this.userService.findById(userId);

      // return this.authService.login(user);
      return;
    } catch (error) {
      if (error.code === 'ERR_CRYPTO_INVALID_IV') {
        throw new BadRequestException('Invalid IV');
      }
      throw error;
    }
  }
}

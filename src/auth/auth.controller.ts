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
} from '@nestjs/common';
import { Auth } from 'aws-amplify';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { RegisterDTO } from './DTO/register.dto';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/user.interface';
import { Public } from 'src/guard/jwt-auth.guard';
import { LoginDTO } from './DTO/login.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { WalletVerifyDTO } from './DTO/walletVerify.dto';
import { ForgotPasswordDTO } from './DTO/forgotPassword.dto';
import { MailService } from 'src/modules/mail/mail.service';
import { ResetPasswordDTO } from './DTO/resetPassword.dto';
// import { RedisCacheService } from 'src/modules/redisCache/redisCache.service';
import { LoginGoogleDTO } from './DTO/loginGoogle.dto';
import { TwitterGuard } from './twitter.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService, // private readonly redisCacheService: RedisCacheService,
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

  // @Post('/forgot-password')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @Public()
  // async forgotPassword(@Body() body: ForgotPasswordDTO) {
  //   try {
  //     const user = await this.userService.getUserByEmail(body.email);
  //     if (!user) {
  //       throw new NotFoundException('User not found!');
  //     }

  //     return this.mailService.sendForgotPasswordEmail(user);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

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

  @Get('/twitter')
  @UseGuards(TwitterGuard)
  async twitterAuth() {}

  @Get('/twitter/callback')
  @UseGuards(TwitterGuard)
  @Redirect('http://localhost:3000', 302)
  async twitterGuardRedirect(@Req() req: any) {
    console.log(req);
  }
}

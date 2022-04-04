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
import { User } from 'src/modules/user/user.interface';
import { Public } from 'src/guard/jwt-auth.guard';
import { LoginDTO } from './DTO/login.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { WalletVerifyDTO } from './DTO/walletVerify.dto';
import { ForgotPasswordDTO, VerifyOtpDTO, UpdatePasswordDTO } from './DTO/forgotPassword.dto';
import { MailService } from 'src/modules/mail/mail.service';
import { ResetPasswordDTO } from './DTO/resetPassword.dto';
import { RedisService } from 'src/modules/redis/redis.service';
import { LoginGoogleDTO } from './DTO/loginGoogle.dto';
import { JwtResponse } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService, // private readonly redisCacheService: RedisCacheService,
    private readonly redisService: RedisService,
  ) { }

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
      // const user = await this.userService.getUserByEmail(email);
      if (!email) {
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
      console.log('======================================')
      console.log(JSON.stringify({ token, otp }, null, 4));
      console.log('======================================')
      try {
        const decoded: JwtResponse = this.authService.verifyOtp(token);
        console.log('------------------------------------')
        console.log(JSON.stringify({ decoded, otp }));
        console.log('------------------------------------')
        if (!otp || String(decoded.otp) !== String(otp)) {
          throw new BadRequestException('Invalid OTP!');
        }
        return;
      } catch (error) {
        console.log('+++++++++++++++++++++++++++++++++++++')
        console.log(error);
        console.log('+++++++++++++++++++++++++++++++++++++')
        throw new BadRequestException('Token expired!');
      }
    } catch (error) {
      throw error;
    }
  }

  @Post('/update-password')
  @HttpCode(HttpStatus.OK)
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
}

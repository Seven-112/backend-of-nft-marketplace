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
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { RegisterDTO } from './DTO/register.dto';
import { UserService } from 'src/modules/user/user.service';
import { RequestWithUser, User } from 'src/modules/user/user.interface';
import { Public } from 'src/guard/jwt-auth.guard';
import { LoginDTO } from './DTO/login.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { WalletService } from 'src/modules/wallet/wallet.service';
import { WalletVerifyDTO } from './DTO/walletVerify.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private walletService: WalletService,
  ) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  @UsePipes(new ValidationPipe())
  async register(@Body() body: RegisterDTO) {
    try {
      const isUsernameAvailable = await this.userService.isUsernameAvailable(
        body.username,
      );
      if (!isUsernameAvailable) {
        throw new ConflictException('Username is not available');
      }
      const isEmailAvailable = await this.userService.isEmailAvailable(
        body.email,
      );
      if (!isEmailAvailable) {
        throw new ConflictException('Email is not available');
      }

      // hashing password
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(body.password, salt);
      const user = new User(body.username, body.email, password);

      // register user
      const registeredUser = await this.userService.create(user);
      Reflect.deleteProperty(registeredUser, 'password');

      return registeredUser;
    } catch (error) {
      throw error;
    }
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @Public()
  @UsePipes(new ValidationPipe())
  async login(@Body() body: LoginDTO) {
    try {
      const user = await this.userService.getUserByEmail(body.email);
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      const isValidPassword = await bcrypt.compare(
        body.password,
        user.password,
      );
      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid password');
      }
      return this.authService.login(user);
    } catch (error) {
      throw error;
    }
  }

  @Get('/isAuthenticated')
  @HttpCode(HttpStatus.OK)
  async isAuthenticated(@Req() req: RequestWithUser) {
    try {
      Reflect.deleteProperty(req.user, 'password');
      const wallets = await this.walletService.findByUserId(req.user.id);
      return {
        ...req.user,
        wallets,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/wallet/request')
  @HttpCode(HttpStatus.OK)
  @Public()
  async walletRequest() {
    return this.walletService.generateKey();
  }

  @Post('/wallet/verify')
  @HttpCode(HttpStatus.OK)
  @Public()
  async walletVerify(@Body() body: WalletVerifyDTO) {
    const isValid = await this.walletService.verifyKey(
      body.key,
      body.iv,
      body.publicKey,
      body.sign,
    );

    if (!isValid) {
      throw new BadRequestException();
    }

    const wallet = await this.walletService.findByWalletAddress(body.publicKey);

    if (!wallet.count) {
      throw new NotFoundException();
    }

    const userId = wallet?.[0]?.userId;

    const user = await this.userService.findById(userId);
    return this.authService.login(user);
  }
}

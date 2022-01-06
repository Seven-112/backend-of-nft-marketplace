import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { transaction } from 'dynamoose';
import { Public } from 'src/guard/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { RequestWithUser, UserRoles } from '../user/user.interface';
import { UserService } from '../user/user.service';

import { AddWalletDTO } from './DTO/addWallet.dto';
import { RemoveWalletDTO } from './DTO/removeWallet.dto';
import { Wallet } from './wallet.interface';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly userService: UserService,
  ) {}

  @Get(':address')
  @HttpCode(HttpStatus.OK)
  @Public()
  async getWallet(@Param('address') address: string) {
    const wallet = await this.walletService.findByWalletAddress(address);

    if (!wallet.count) {
      throw new NotFoundException();
    }

    return wallet[0];
  }

  @Post('/add')
  @UsePipes(new ValidationPipe())
  async addWallet(@Req() req: RequestWithUser, @Body() body: AddWalletDTO) {
    try {
      const isWalletAvailable =
        await this.walletService.isWalletAddressAvailable(body.walletAddress);

      if (!isWalletAvailable) {
        throw new ConflictException('Wallet address is not available');
      }

      const user = req.user;
      const wallet = new Wallet(user.id, body.walletAddress, body.walletType);

      user.wallets = [
        ...user.wallets,
        { address: body.walletAddress, type: body.walletType },
      ];

      if (!user.roles.includes(UserRoles.user)) {
        user.roles.push(UserRoles.user);
      }

      await transaction([
        this.walletService.createTransaction(wallet),
        this.userService.updateUserTransaction(user),
      ]);

      return user;
    } catch (error) {
      throw error;
    }
  }

  @Delete('/remove')
  @UsePipes(new ValidationPipe())
  async removeWallet(@Body() body: RemoveWalletDTO) {
    try {
      const wallet = await this.walletService.findByWalletAddress(
        body.walletAddress,
      );
      if (!wallet.count) {
        throw new NotFoundException();
      }
      const user = await this.userService.findById(wallet[0].userId);
      if (!user) {
        throw new NotFoundException();
      }

      user.wallets = user.wallets.filter(
        (wallet) => wallet.address !== body.walletAddress,
      );

      if (!user.wallets.length) {
        user.roles = user.roles.filter((role) => role !== UserRoles.user);
      }

      await transaction([
        this.walletService.deleteWalletTransaction(wallet[0].id),
        this.userService.updateUserTransaction(user),
      ]);

      return user;
    } catch (error) {
      throw error;
    }
  }
}

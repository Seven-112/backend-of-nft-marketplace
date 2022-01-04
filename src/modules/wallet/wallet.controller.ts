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
} from '@nestjs/common';
import { Public } from 'src/guard/jwt-auth.guard';
import { RequestWithUser } from '../user/user.interface';

import { AddWalletDTO } from './DTO/addWallet.dto';
import { RemoveWalletDTO } from './DTO/removeWallet.dto';
import { Wallet } from './wallet.interface';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

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
  async addWallet(@Req() req: RequestWithUser, @Body() body: AddWalletDTO) {
    try {
      const isWalletAvailable =
        await this.walletService.isWalletAddressAvailable(body.walletAddress);

      if (!isWalletAvailable) {
        throw new ConflictException('Wallet is not available');
      }

      const user = req.user;
      const wallet = new Wallet(user.id, body.walletAddress, body.walletType);
      await this.walletService.create(wallet);
      const userWallets = await this.walletService.findByUserId(user.id);

      return {
        ...user,
        wallets: userWallets,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('/remove')
  async removeWallet(@Body() body: RemoveWalletDTO) {
    try {
      const wallet = await this.walletService.findByWalletAddress(
        body.walletAddress,
      );

      if (!wallet.count) {
        throw new NotFoundException();
      }

      return this.walletService.deleteWallet(wallet[0].id);
    } catch (error) {
      throw error;
    }
  }
}

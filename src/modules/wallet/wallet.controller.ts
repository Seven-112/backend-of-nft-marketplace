import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { Public } from 'src/guard/jwt-auth.guard';

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
}

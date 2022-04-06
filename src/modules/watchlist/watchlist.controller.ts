import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UpdateWatchlistDTO } from './DTO/update-watchlist.dto';
import { Watchlist } from './watchlist.interface';
import { WatchlistService } from './watchlist.service';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async update(@Req() request: any, @Body() body: UpdateWatchlistDTO) {
    const watchlist = new Watchlist();
    watchlist.id = request.user.sub;
    watchlist.list = body.list;

    const updated = await this.watchlistService.update(watchlist);
    updated.list = Array.from(updated.list);

    return {
      code: 200,
      message: 'Updated watchlist',
      data: updated,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async get(@Req() request: any) {
    const watchlist = await this.watchlistService.get(request.user.sub);

    watchlist.list = Array.from(watchlist.list);

    return {
      code: 200,
      message: '',
      data: watchlist || {
        id: request.user.sub,
        list: [],
      },
    };
  }
}

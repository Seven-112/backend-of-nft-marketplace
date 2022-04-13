import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UserService } from '../user/user.service';
import {
  AddWatchlistDTO,
  RemoveWatchlistDTO,
} from './DTO/update-watchlist.dto';
import { WatchlistService } from './watchlist.service';

@Controller('watchlist')
export class WatchlistController {
  constructor(
    private readonly watchlistService: WatchlistService,
    private readonly userService: UserService,
  ) {}

  @Patch('/add')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async add(@Req() request: any, @Body() body: AddWatchlistDTO) {
    const currentWatchlist = (await this.watchlistService.get(
      request.user.sub,
    )) || {
      id: request.user.sub,
      list: [],
    };

    currentWatchlist.list = Array.from(
      new Set(currentWatchlist.list).add(body.address),
    );

    const updated = await this.watchlistService.update(currentWatchlist);
    updated.list = Array.from(updated.list);

    return {
      code: 200,
      message: 'Updated watchlist',
      data: updated,
    };
  }

  @Patch('/remove')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async remove(@Req() request: any, @Body() body: RemoveWatchlistDTO) {
    const currentWatchlist = (await this.watchlistService.get(
      request.user.sub,
    )) || {
      id: request.user.sub,
      list: [],
    };

    const newList = new Set(currentWatchlist.list);
    body.addresses.forEach((address) => newList.delete(address));

    currentWatchlist.list = Array.from(newList.size ? newList : []);

    const updated = await this.watchlistService.update(currentWatchlist);
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
  @ApiQuery({
    name: 'relations',
    required: false,
    explode: false,
    type: String,
    isArray: true,
  })
  async get(@Req() request: any, @Query('relations') relations?: string[]) {
    const watchlist = (await this.watchlistService.get(request.user.sub)) || {
      id: request.user.sub,
      list: [],
      users: [],
    };

    if (relations?.includes('users')) {
      const promises =
        watchlist?.list.map((item) =>
          this.userService.getByWalletAddress(item),
        ) || [];

      watchlist.users = (await Promise.all(promises)).map((item) => item[0]);
    }

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

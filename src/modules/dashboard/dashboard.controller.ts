import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import * as moment from 'moment';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { EventService } from '../event/event.service';
import { NftService } from '../nft/nft.service';
import { UserRole } from '../user/user.interface';
import { UserService } from '../user/user.service';

@Controller('dashboards')
export class UserController {
  constructor(
    private userService: UserService,
    private eventService: EventService,
    private nftService: NftService,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async dashboard(@Req() request: any) {
    const user = await this.userService.getUserById(request.user.sub);

    if (user.deletedAt) {
      return {
        code: 400,
        message: 'user_is_deleted',
      };
    }
    if (user.role !== UserRole.Admin) {
      return {
        code: 400,
        message: 'user_not_permission',
      };
    }

    const lastWeekStartDate = moment()
      .subtract(1, 'weeks')
      .startOf('isoWeek')
      .valueOf();
    const lastWeekEndDate = moment()
      .subtract(1, 'weeks')
      .endOf('isoWeek')
      .valueOf();
    const currentWeekStartDate = moment().startOf('isoWeek').valueOf();
    const currentWeekEndDate = moment().valueOf();

    let [
      lastWeekUsers,
      currentWeekUsers,
      allUsers,
      lastWeekNftBought,
      currentWeekNftBought,
      allBought,
      lastWeekEvents,
      currentWeekEvents,
      allEvents,
    ] = await Promise.all([
      this.userService.getDataByTime(lastWeekStartDate, lastWeekEndDate),
      this.userService.getDataByTime(currentWeekStartDate, currentWeekEndDate),
      this.userService.getAllUsers(),
      this.nftService.getDataByTime(lastWeekStartDate, lastWeekEndDate),
      this.nftService.getDataByTime(currentWeekStartDate, currentWeekEndDate),
      this.nftService.getAllUserBought(),
      this.eventService.getDataByTime(lastWeekStartDate, lastWeekEndDate),
      this.eventService.getDataByTime(currentWeekStartDate, lastWeekEndDate),
      this.eventService.getAllEvents(),
    ]);
    let userPercent = lastWeekUsers.length
      ? ((currentWeekUsers.length - lastWeekUsers.length) /
          lastWeekUsers.length) *
        100
      : 100;

    if (!currentWeekUsers.length && !lastWeekUsers.length) {
      userPercent = 0;
    }

    let eventPercent = lastWeekEvents.length
      ? ((currentWeekEvents.length - lastWeekEvents.length) /
          lastWeekEvents.length) *
        100
      : 100;

    if (!currentWeekEvents.length && !lastWeekEvents.length) {
      eventPercent = 0;
    }

    lastWeekNftBought = await lastWeekNftBought['populate']();
    currentWeekNftBought = await currentWeekNftBought['populate']();

    const lastWeekTotalPrice = lastWeekNftBought
      .map((nftBought) => +nftBought.nft?.price || 0)
      .reduce((prev, current) => prev + current, 0);
    const currentWeekTotalPrice = currentWeekNftBought
      .map((nftBought) => +nftBought.nft?.price || 0)
      .reduce((prev, current) => prev + current, 0);
    const totalPrice = allBought
      .map((nftBought) => +nftBought.nft?.price || 0)
      .reduce((prev, current) => prev + current, 0);

    let boughtPercent = lastWeekTotalPrice
      ? ((currentWeekTotalPrice - lastWeekTotalPrice) / lastWeekTotalPrice) *
        100
      : 100;

    if (!currentWeekTotalPrice && !lastWeekTotalPrice) {
      boughtPercent = 0;
    }

    const responseData = {
      user: {
        percent: userPercent.toFixed(2),
        total: allUsers.length,
      },
      event: {
        percent: eventPercent.toFixed(2),
        total: allEvents.length,
      },
      nftBought: {
        percent: boughtPercent.toFixed(2),
        total: totalPrice,
      },
    };

    return {
      code: 200,
      message: 'successful',
      data: responseData,
    };
  }
}

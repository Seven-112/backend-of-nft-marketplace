import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, Public } from 'src/guard/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { UserService } from '../user/user.service';
import { CreateStakingDTO } from './DTO/create-staking.dto';
import { Staking } from './staking.interface';
import { StakingService } from './staking.service';
import * as moment from 'moment';

@Controller('stakings')
export class StakingController {
  constructor(
    private readonly stakingService: StakingService,
  ) {}

  @Post('/')
  @Public()
  @UsePipes(new ValidationPipe())
  async createEvent(@Req() request: any, @Body() body: CreateStakingDTO) {
    let staking = new Staking();
    Object.assign(staking, body);
    staking.stakedTime = new Date().getTime();

    staking = await this.stakingService.create(staking);
    return {
      code: 201,
      message: 'created',
      data: staking,
    };
  }

  @Get('/analysis')
  @Public()
  async getEventAnalisys(@Req() request: any) {
    const currentTime = moment().valueOf();

    const firstDailyTime = moment(
      moment().format('YYYY-MM-DD 00:00'),
    ).valueOf();

    const firstWeeklyTime = moment().startOf('week').valueOf();
    const firstMonthlyTime = moment(
      moment().format('YYYY-01-01 00:00:00'),
    ).valueOf();
    const firstYearTime = moment(
      moment().format('1970-01-01 00:00:00'),
    ).valueOf();

    let results = await Promise.all([
      this.stakingService.getDataByTime(firstDailyTime, currentTime),
      this.stakingService.getDataByTime(firstWeeklyTime, currentTime),
      this.stakingService.getDataByTime(firstMonthlyTime, currentTime),
      this.stakingService.getDataByTime(firstYearTime, currentTime)
    ]) as any;
    let [
      userTicketDaily,
      userTicketWeekly,
      userTicketMonthly,
      userTicketYearly
    ] = await Promise.all(results.map(result => result['toJSON']()));

    // Get data daily.
    const currentHour = moment(currentTime).format('HH');
    const dailyData = this.stakingService.formatEventData(userTicketDaily, +currentHour, 'hours', 'HH:00', 'HH');


    // Get data weekly.
    const endOfWeek = moment().endOf('week').weekday();
    let currentDate = moment().endOf('week');
    const weeklyData = this.stakingService.formatEventData(userTicketWeekly, endOfWeek, 'days', 'YYYY-MM-DD', 'DD', currentDate);

    // // Get data monthly.
    let duration = 11;
    currentDate = moment().endOf('year');
    const monthlyData = this.stakingService.formatEventData(userTicketMonthly, duration, 'months', 'MMM', 'MM', currentDate)

    // // Get data yearly.
    const currentYear = moment(currentTime);
    const firstItem = userTicketYearly.sort((a, b) => a.timestamp - b.timestamp)
      .find(item => +moment(item.createdAt).format('YYYY') <= +currentYear.format('YYYY'));
    if(!firstItem) {
      duration = 1;
    } else {
      const firstYear = firstItem.createdAt;
      duration = moment.duration(currentYear.diff(firstYear)).asYears();
    }
    const allTimeData = this.stakingService.formatEventData(userTicketYearly, duration, 'years', 'YYYY', 'YYYYY')

    // format data response.
    const responseData = this.stakingService.formatDataAnalysisResponse(
      dailyData,
      weeklyData, 
      monthlyData, 
      allTimeData, 
      0
    );

    // response.
    return {
      code: 200,
      message: '',
      data: responseData,
    };
  }
}

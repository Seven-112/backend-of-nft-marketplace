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
import { UserRole } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { CreateEventDTO, UpdateEventDTO } from './DTO/create-event.dto';
import { BuyTicketDTO } from './DTO/buyTicket.dto';
import { Event, Ticket } from './event.interface';
import { EventService } from './event.service';
import { UserTicket } from './userTicket.interface';
import * as moment from 'moment';

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) {}

  @Post('/create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createEvent(@Req() request: any, @Body() body: CreateEventDTO) {
    const ticket = new Ticket();
    Object.assign(ticket, body.ticket);
    ticket.saleStart = new Date(body.ticket.saleStart);
    ticket.saleEnd = new Date(body.ticket.saleEnd);
    ticket.remain = body.ticket.quantity;

    const event = new Event();
    Object.assign(event, body);
    event.user = request.user.sub;
    event.startDate = new Date(body.startDate);
    event.endDate = new Date(body.endDate);
    event.publishDate = new Date(body.publishDate);
    event.ticket = { ...ticket };

    const newEvent = await this.eventService.createEvent(event);
    return {
      code: 201,
      message: 'Event created',
      data: newEvent,
    };
  }

  @Patch('/update')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateEvent(@Req() request: any, @Body() body: UpdateEventDTO) {
    const user = await this.userService.getUserById(request.user.sub);
    const foundEvent = await this.eventService.getEventById(body.id);

    if (!user)
      return {
        code: 404,
        message: 'User not found',
        data: null,
      };

    if (user.role !== UserRole.Admin)
      return {
        code: 403,
        message: 'Not allowed',
        data: null,
      };

    if (!foundEvent)
      return {
        code: 404,
        message: 'Event not found',
      };

    const { id } = body;

    delete body.id;

    const updateBody = {
      ...body,
      publishDate: new Date(body.publishDate),
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      createdAt: new Date(body.createdAt),
      ticket: {
        ...body.ticket,
        saleStart: new Date(body.ticket.saleStart),
        saleEnd: new Date(body.ticket.saleEnd),
      },
    };

    const updatedEvent = await this.eventService.updateEvent(id, updateBody);

    return {
      code: 201,
      message: 'Event updated',
      data: updatedEvent,
    };
  }

  @Get('/')
  @Public()
  async getEvents(@Query('limit') limit?: number) {
    const events = await this.eventService.getAllEvents(limit);

    return {
      code: 200,
      message: '',
      data: { events, length: events.length },
    };
  }

  @Get('/analysis')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Public()
  async getEventAnalisys(@Req() request: any) {
    // const user = await this.userService.getUserById(request.user.sub);

    // if (user.role !== UserRole.Admin)
    //   return {
    //     code: 403,
    //     message: 'Not allowed',
    //     data: null,
    //   };
    const dailyData = [];
    const weeklyData = [];
    const monthlyData = [];
    const allTimeData = [];
    const currentTime = moment().valueOf();

    // Get all available tickets.
    let availableTicketSellEvents = await (
      await this.eventService.getEventAvailable(currentTime)
    )['toJSON']();
    const totalAvailableTickets = availableTicketSellEvents
      .map((evt) => evt.ticket.remain)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    // Get data daily.
    const firstDailyTime = moment(
      moment().format('YYYY-MM-DD 00:00'),
    ).valueOf();
    let userTicketDaily = await (
      await this.eventService.getUserTicketByTime(firstDailyTime, currentTime)
    )['populate']();
    userTicketDaily = await userTicketDaily['toJSON']();
    const currentHour = moment(currentTime).format('HH');
    for (let i = 0; i <= 23; i++) {
      const data = {
        time: moment()
          .subtract(+currentHour - i, 'hours')
          .format('HH:00'),
        total: userTicketDaily
          .filter(
            (userTicket) => +moment(userTicket.createdAt).format('HH') === i,
          )
          .map((userTicket) => userTicket.number_ticket)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          ),
      };
      dailyData.push(data);
    }

    // Get data weekly.
    const firstWeeklyTime = moment().startOf('isoWeek').valueOf();
    let userTicketWeekly = await (
      await this.eventService.getUserTicketByTime(firstWeeklyTime, currentTime)
    )['populate']();
    userTicketWeekly = await userTicketWeekly['toJSON']();

    const currentDate = moment(currentTime).isoWeekday();
    for (let i = 1; i <= +currentDate; i++) {
      const data = {
        time: moment()
          .subtract(currentDate - i, 'days')
          .format('YYYY-MM-DD'),
        total: userTicketWeekly
          .filter(
            (userTicket) =>
              moment(userTicket.createdAt).format('DD') ===
              moment()
                .subtract(currentDate - i, 'days')
                .format('DD'),
          )
          .map((userTicket) => userTicket.number_ticket)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          ),
      };
      weeklyData.push(data);
    }

    // Get data monthly.
    const firstMonthlyTime = moment(
      moment().format('YYYY-MM-01 00:00:00'),
    ).valueOf();
    let duration = +moment(currentTime).format('DD');
    let userTicketMonthly = await (
      await this.eventService.getUserTicketByTime(firstMonthlyTime, currentTime)
    )['populate']();
    userTicketMonthly = await userTicketMonthly['toJSON']();

    for (let i = 1; i <= +duration; i++) {
      const data = {
        time: moment()
          .subtract(duration - i, 'days')
          .format('YYYY-MM-DD'),
        total: userTicketMonthly
          .filter(
            (userTicket) =>
              moment(userTicket.createdAt).format('DD') ===
              moment()
                .subtract(duration - i, 'days')
                .format('DD'),
          )
          .map((userTicket) => userTicket.number_ticket)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          ),
      };
      monthlyData.push(data);
    }

    // Get data yearly.
    const firstYearTime = moment(
      moment().format('YYYY-01-01 00:00:00'),
    ).valueOf();
    duration = +moment(currentTime).format('MM');
    let userTicketYearly = await (
      await this.eventService.getUserTicketByTime(firstYearTime, currentTime)
    )['populate']();
    userTicketYearly = await userTicketYearly['toJSON']();

    for (let i = 1; i <= +duration; i++) {
      const data = {
        time: moment()
          .subtract(duration - i, 'months')
          .format('YYYY-MM'),
        total: userTicketYearly
          .filter(
            (userTicket) =>
              moment(userTicket.createdAt).format('MM') ===
              moment()
                .subtract(duration - i, 'months')
                .format('MM'),
          )
          .map((userTicket) => userTicket.number_ticket)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          ),
      };
      allTimeData.push(data);
    }

    // format data response.
    const responseData = {
      daily: {
        data: dailyData,
        availableTickets: totalAvailableTickets,
        soldTickets: dailyData
          .map((dt) => dt.total)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          ),
      },
      weekly: {
        data: weeklyData,
        availableTickets: totalAvailableTickets,
        soldTickets: weeklyData
          .map((dt) => dt.total)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          ),
      },
      monthly: {
        data: monthlyData,
        availableTickets: totalAvailableTickets,
        soldTickets: monthlyData
          .map((dt) => dt.total)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          ),
      },
      allTime: {
        data: allTimeData,
        availableTickets: totalAvailableTickets,
        soldTickets: allTimeData
          .map((dt) => dt.total)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
          ),
      },
    };

    // response.
    return {
      code: 200,
      message: '',
      data: responseData,
    };
  }

  @Get('/:id')
  @ApiQuery({
    name: 'relations',
    required: false,
    explode: false,
    type: String,
    isArray: true,
  })
  @Public()
  async getEventById(
    @Param('id') id: string,
    @Query('relations') relations?: string[],
  ) {
    let event = await this.eventService.getEventById(id);
    event = await event.populate({ properties: relations });

    return {
      code: 200,
      message: '',
      data: event,
    };
  }

  @Post('/:id/buy-ticket')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async buyEventTicket(
    @Param('id') id: string,
    @Req() request: any,
    @Body() body: BuyTicketDTO,
  ) {
    const user = await this.userService.getUserById(request.user.sub);
    let event = await this.eventService.getEventById(id);

    // Check user is existed.
    if (!user)
      return {
        code: 404,
        message: 'User not found',
        data: null,
      };

    // Check number ticket is required.
    if (!body.number_ticket) {
      return {
        code: 400,
        message: 'number_ticket_is_required',
        data: null,
      };
    }
    // Check if number ticket user buy great than ticket remain throw error.
    if (body.number_ticket > event.ticket.remain) {
      return {
        code: 400,
        message: 'number_ticket_great_than_ticket_remain',
        data: null,
      };
    }

    // Insert ticket into user ticket.
    const userTicketData = new UserTicket();
    userTicketData.event = event;
    userTicketData.user = user;
    userTicketData.number_ticket = body.number_ticket;
    await this.eventService.createUserTicket(userTicketData);

    // Update remain ticket.
    event.ticket.remain -= +body.number_ticket;
    delete event.id;
    delete event.updatedAt;
    event = await this.eventService.updateEvent(id, event);

    return {
      code: 200,
      message: 'buy_ticket_successful',
      data: event,
    };
  }
}

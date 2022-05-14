import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';
import { EventController } from './event.controller';

import { EventSchema } from './event.schema';
import { EventService } from './event.service';
import { UserTicketSchema } from './userTicket.schema';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Event',
        schema: EventSchema,
      },
      {
        name: 'UserTicket',
        schema: UserTicketSchema,
      },
    ]),
    UserModule,
    RedisModule,
  ],
  providers: [EventService],
  exports: [EventService],
  controllers: [EventController],
})
export class EventModule {}

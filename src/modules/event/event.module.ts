import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { EventController } from './event.controller';

import { EventSchema } from './event.schema';
import { EventService } from './event.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Event',
        schema: EventSchema,
      },
    ]),
  ],
  providers: [EventService],
  exports: [EventService],
  controllers: [EventController],
})
export class EventModule {}

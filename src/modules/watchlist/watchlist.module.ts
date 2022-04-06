import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { WatchlistController } from './watchlist.controller';
import { WatchlistSchema } from './watchlist.schema';
import { WatchlistService } from './watchlist.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Watchlist',
        schema: WatchlistSchema,
      },
    ]),
  ],
  exports: [WatchlistService],
  providers: [WatchlistService],
  controllers: [WatchlistController],
})
export class WatchlistModule {}

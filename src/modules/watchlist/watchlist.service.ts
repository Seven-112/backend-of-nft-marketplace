import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Watchlist } from './watchlist.interface';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel('Watchlist')
    private watchlistModel: Model<Watchlist, Watchlist['id']>,
  ) {}

  async update(watchlist: Watchlist) {
    return this.watchlistModel.update(watchlist);
  }

  async get(id: string) {
    return this.watchlistModel.get(id);
  }
}

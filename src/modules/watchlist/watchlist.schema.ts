import { Schema } from 'dynamoose';

export const WatchlistSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  list: {
    type: Set,
    schema: [String],
    default: [],
  },
});

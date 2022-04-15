import { Schema, model } from 'dynamoose';
import { User } from '../user/user.schema';

export const ChannelSchema = new Schema(
  {
    id: {
      type: String,
    },
    from: User,
    to: User,
    name: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      default: new Date().getTime()
    }
  },
  {
    timestamps: true,
  },
);

export const Support = model('Channels', ChannelSchema);

import { Schema, model } from 'dynamoose';
import { User } from '../user/user.schema';

export const StakingSchema = new Schema({
  id: {
    type: String,
  },
  type: {
    type: String,
    enum: ['staking', 'unstaking'],
  },
  amount: {
    type: Number,
  },
  stakedTime: {
    type: Number,
  },
  wallet: {
    type: String,
  }
}, {
  timestamps: true
});

export const Event = model('Event', StakingSchema);

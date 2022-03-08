import { Schema } from 'dynamoose';

export const UserSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  walletAddress: {
    type: String,
    required: false,
  },
  email: {
    type: String,
  },
});

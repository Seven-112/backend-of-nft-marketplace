import { Schema, model } from 'dynamoose';

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
  username: {
    type: String,
    required: false,
  },
  job: {
    type: String,
    required: false,
  },
  personalWebsite: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  timezone: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  role: {
    type: String,
  },
  status: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

export const User = model('User', UserSchema)

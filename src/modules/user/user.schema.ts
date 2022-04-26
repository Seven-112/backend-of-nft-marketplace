import { Schema, model } from 'dynamoose';

export const SocialSchema = new Schema({
  youtube: {
    type: String,
    required: false,
  },
  facebook: {
    type: String,
    required: false,
  },
  twitter: {
    type: String,
    required: false,
  },
  instagram: {
    type: String,
    required: false,
  },
  discord: {
    type: String,
    required: false,
  },
  telegram: {
    type: String,
    required: false,
  },
});

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
    type: Number,
  },
  social: SocialSchema,
  deletedAt: {
    type: Number
  }
});

export const User = model('User', UserSchema);

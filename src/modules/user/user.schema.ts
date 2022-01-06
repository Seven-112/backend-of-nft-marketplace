import { Schema } from 'dynamoose';
import { baseSchema } from 'src/common/model';
import { UserType } from './user.interface';

export const UserWalletSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

export const UserSchema = new Schema({
  ...baseSchema,
  username: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    index: {
      name: 'emailIndex',
      global: true,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
  },
  roles: {
    type: Array,
    schema: [String],
  },
  wallets: {
    type: Array,
    schema: [UserWalletSchema],
  },
  type: {
    type: String,
    enum: Object.keys(UserType),
  },
  social: {
    type: Object,
    schema: {
      facebookId: {
        type: String,
      },
      googleId: {
        type: String,
      },
      twitterId: {
        type: String,
      },
    },
    default: {},
  },
});

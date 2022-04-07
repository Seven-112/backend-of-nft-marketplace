import { Schema, model } from 'dynamoose';

export const SubscriptionSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    email: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  },
);

export const Subscription = model('Subscription', SubscriptionSchema);

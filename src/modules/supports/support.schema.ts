import { Schema, model } from 'dynamoose';
export const FileSchema = new Schema({
  extension: {
    type: String,
  },
  url: {
    type: String,
  }
});

export const SupportSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    ticket_uuid: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    blockchain: {
      type: String,
      required: true
    },
    transaction_hash: {
      type: String,
      required: true
    },
    wallet: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    file: FileSchema,
    status: {
      type: String,
      default: 'open',
      required: false
    }
  },
  {
    timestamps: true,
  },
);

export const Support = model('Support', SupportSchema);

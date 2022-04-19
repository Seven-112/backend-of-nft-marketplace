"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = exports.SubscriptionSchema = void 0;
const dynamoose_1 = require("dynamoose");
exports.SubscriptionSchema = new dynamoose_1.Schema({
    id: {
        type: String,
        hashKey: true,
    },
    email: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});
exports.Subscription = (0, dynamoose_1.model)('Subscription', exports.SubscriptionSchema);
//# sourceMappingURL=subscription.schema.js.map
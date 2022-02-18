"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.baseSchema = exports.BaseModel = void 0;
const nanoid_1 = require("nanoid");
class BaseModel {
    constructor() {
        this.id = (0, nanoid_1.nanoid)(12);
        this.createdAt = new Date().getTime();
        this.updatedAt = new Date().getTime();
    }
}
exports.BaseModel = BaseModel;
exports.baseSchema = {
    id: {
        type: String,
        hashKey: true,
    },
    createdAt: {
        type: Number,
    },
    updatedAt: {
        type: Number,
    },
    updatedBy: {
        type: Object,
        schema: {
            userId: {
                type: Number,
            },
            username: {
                type: String,
            },
        },
    },
};
class UserModel extends BaseModel {
}
exports.UserModel = UserModel;
//# sourceMappingURL=model.js.map
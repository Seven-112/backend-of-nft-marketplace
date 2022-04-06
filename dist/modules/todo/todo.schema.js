"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoSchema = void 0;
const dynamoose_1 = require("dynamoose");
const model_1 = require("../../common/model");
exports.TodoSchema = new dynamoose_1.Schema(Object.assign(Object.assign({}, model_1.baseSchema), { name: { type: String }, isDone: { type: Boolean } }));
//# sourceMappingURL=todo.schema.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const common_1 = require("@nestjs/common");
const Joi = require("joi");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
const error_1 = require("../../utils/error");
let TodoService = class TodoService {
    constructor(todoModel) {
        this.todoModel = todoModel;
    }
    async findAll() {
        return this.todoModel.scan().exec();
    }
    async remove(id) {
        return this.todoModel.delete(id);
    }
    async findOne(id) {
        const todo = await this.todoModel.get(id);
        if (!todo) {
            throw new error_1.NotFoundError('todo', { id: id });
        }
        return todo;
    }
};
TodoService.joiSchemaCreate = Joi.object({
    name: Joi.string().trim().min(1).required(),
});
TodoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_dynamoose_1.InjectModel)('Todo')),
    __metadata("design:paramtypes", [Object])
], TodoService);
exports.TodoService = TodoService;
//# sourceMappingURL=todo.service.js.map
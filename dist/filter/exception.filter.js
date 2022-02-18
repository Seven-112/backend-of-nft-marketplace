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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const pino_1 = require("pino");
const logger_1 = require("../utils/logger");
const userErrors = [
    {
        name: 'EntityNotFound',
        status: 404,
    },
    {
        name: 'HttpError',
    },
    {
        name: 'NotFoundError',
    },
    { name: 'JobError' },
    {
        name: 'ValidationError',
        status: 400,
    },
];
const logger = (0, pino_1.default)(Object.assign(Object.assign({}, logger_1.defaultPinoOptions), { name: 'errorHandler' }));
let AllExceptionsFilter = class AllExceptionsFilter {
    constructor(httpAdapterHost) {
        this.httpAdapterHost = httpAdapterHost;
    }
    catch(err, host) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const userError = userErrors.find((ue) => ue.name === err.name);
        if (!userError) {
            logger.error(err);
        }
        let statusCode = (userError === null || userError === void 0 ? void 0 : userError.status) || err.status || err.statusCode;
        if (!statusCode || statusCode < 100 || statusCode > 599)
            statusCode = 500;
        httpAdapter.reply(ctx.getResponse(), {
            message: err.message,
            status: statusCode,
            data: err.data,
            errors: err.errors,
        }, statusCode);
    }
};
AllExceptionsFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost])
], AllExceptionsFilter);
exports.AllExceptionsFilter = AllExceptionsFilter;
//# sourceMappingURL=exception.filter.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const http_exception_1 = require("@nestjs/common/exceptions/http.exception");
const capitalizeFirstLetter_1 = require("../utils/capitalizeFirstLetter");
let ValidationPipe = class ValidationPipe {
    async transform(value, metadata) {
        if (!value) {
            throw new common_1.BadRequestException('No data submitted');
        }
        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = (0, class_transformer_1.plainToClass)(metatype, value);
        const errors = await (0, class_validator_1.validate)(object);
        if (errors.length > 0) {
            throw new http_exception_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Input data validation failed',
                errors: this.buildError(errors),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        return value;
    }
    buildError(errors) {
        const result = {};
        errors.forEach((el) => {
            const prop = el.property;
            Object.entries(el.constraints).forEach((constraint) => {
                result[prop] = `${(0, capitalizeFirstLetter_1.capitalizeFirstLetter)(constraint[1].substring(constraint[1].indexOf(' ') + 1))}`;
            });
        });
        return result;
    }
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }
};
ValidationPipe = __decorate([
    (0, common_1.Injectable)()
], ValidationPipe);
exports.ValidationPipe = ValidationPipe;
//# sourceMappingURL=validation.pipe.js.map
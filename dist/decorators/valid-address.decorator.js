"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidAddressConstraint = exports.ValidAddress = void 0;
const class_validator_1 = require("class-validator");
const web3 = require("@solana/web3.js");
function ValidAddress(validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: ValidAddressConstraint,
        });
    };
}
exports.ValidAddress = ValidAddress;
let ValidAddressConstraint = class ValidAddressConstraint {
    validate(value) {
        const key = new web3.PublicKey(value);
        const isValid = web3.PublicKey.isOnCurve(key.toBytes());
        return isValid;
    }
};
ValidAddressConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'ValidAddress' })
], ValidAddressConstraint);
exports.ValidAddressConstraint = ValidAddressConstraint;
//# sourceMappingURL=valid-address.decorator.js.map
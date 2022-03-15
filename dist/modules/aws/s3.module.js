"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Module = void 0;
const common_1 = require("@nestjs/common");
const s3_controller_1 = require("./s3.controller");
let S3Module = class S3Module {
};
S3Module = __decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [],
        controllers: [s3_controller_1.S3Controller],
    })
], S3Module);
exports.S3Module = S3Module;
//# sourceMappingURL=s3.module.js.map
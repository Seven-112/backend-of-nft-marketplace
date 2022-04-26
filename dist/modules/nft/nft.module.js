"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFTModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_dynamoose_1 = require("nestjs-dynamoose");
const notification_module_1 = require("../notification/notification.module");
const user_module_1 = require("../user/user.module");
const nft_controller_1 = require("./nft.controller");
const nft_schema_1 = require("./nft.schema");
const nft_service_1 = require("./nft.service");
const userNFTBought_schema_1 = require("./userNFTBought.schema");
let NFTModule = class NFTModule {
};
NFTModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_dynamoose_1.DynamooseModule.forFeature([
                {
                    name: 'Nft',
                    schema: nft_schema_1.NftSchema,
                },
                {
                    name: 'UserNFTBought',
                    schema: userNFTBought_schema_1.UserNFTBoughtSchema,
                },
            ]),
            user_module_1.UserModule,
            notification_module_1.NotificationModule
        ],
        providers: [nft_service_1.NftService],
        exports: [nft_service_1.NftService],
        controllers: [nft_controller_1.NFTController],
    })
], NFTModule);
exports.NFTModule = NFTModule;
//# sourceMappingURL=nft.module.js.map
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
<<<<<<< HEAD:dist/modules/watchlist/DTO/update-watchlist.dto.js
exports.UpdateWatchlistDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const valid_address_decorator_1 = require("../../../decorators/valid-address.decorator");
class UpdateWatchlistDTO {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    (0, valid_address_decorator_1.ValidAddress)(),
    __metadata("design:type", String)
], UpdateWatchlistDTO.prototype, "address", void 0);
exports.UpdateWatchlistDTO = UpdateWatchlistDTO;
//# sourceMappingURL=update-watchlist.dto.js.map
=======
exports.BuyTicketDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class BuyTicketDTO {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BuyTicketDTO.prototype, "number_ticket", void 0);
exports.BuyTicketDTO = BuyTicketDTO;
//# sourceMappingURL=buyTicket.dto.js.map
>>>>>>> c2fc07023c8f1ab195f77af88dc53e3065398202:dist/modules/event/DTO/buyTicket.dto.js

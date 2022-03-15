"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = exports.WalletType = void 0;
const model_1 = require("../../common/model");
var WalletType;
(function (WalletType) {
    WalletType["phantom"] = "phantom";
    WalletType["solflare"] = "solflare";
})(WalletType = exports.WalletType || (exports.WalletType = {}));
class Wallet extends model_1.BaseModel {
    constructor(userId, address, type) {
        super();
        this.userId = userId;
        this.address = address;
        this.type = type;
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=wallet.interface.js.map
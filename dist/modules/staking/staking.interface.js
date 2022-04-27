"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staking = exports.EStakingType = void 0;
const nanoid_1 = require("nanoid");
var EStakingType;
(function (EStakingType) {
    EStakingType["staking"] = "staking";
    EStakingType["unstaking"] = "unstaking";
})(EStakingType = exports.EStakingType || (exports.EStakingType = {}));
class Staking {
    constructor() {
        this.id = (0, nanoid_1.nanoid)(12);
    }
}
exports.Staking = Staking;
//# sourceMappingURL=staking.interface.js.map
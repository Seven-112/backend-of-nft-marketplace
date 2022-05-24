"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirdropStatus = exports.User = void 0;
class User {
}
exports.User = User;
class AirdropStatus {
    constructor(pTotalNftNumber, pCurUserId, pCurUserNftNumber) {
        this.totalNftNumber = pTotalNftNumber;
        this.curUserId = pCurUserId;
        this.curUserNftNumber = pCurUserNftNumber;
    }
    toString() {
        return this.totalNftNumber + ";"
            + this.curUserId + ";"
            + this.curUserNftNumber;
    }
    static fromString(str) {
        const tokens = str.split(';');
        return new AirdropStatus(parseInt(tokens[0]), parseInt(tokens[1]), parseInt(tokens[2]));
    }
}
exports.AirdropStatus = AirdropStatus;
//# sourceMappingURL=airdrop.interface.js.map
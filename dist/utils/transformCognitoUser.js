"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformCognitoUser = void 0;
const transformCognitoUser = (data) => {
    const result = {
        username: data.Username,
    };
    return data.UserAttributes.reduce((acc, val) => (Object.assign(Object.assign({}, acc), { [val.Name]: val.Value })), result);
};
exports.transformCognitoUser = transformCognitoUser;
//# sourceMappingURL=transformCognitoUser.js.map
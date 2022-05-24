"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.programIds = exports.setProgramIds = exports.SYSTEM = exports.METAPLEX_ID = exports.AUCTION_ID = exports.VAULT_ID = exports.METADATA_PROGRAM_ID = exports.MEMO_ID = exports.BPF_UPGRADE_LOADER_ID = exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = exports.TOKEN_PROGRAM_ID = exports.WRAPPED_SOL_MINT = exports.pubkeyToString = exports.toPublicKey = exports.LazyAccountInfoProxy = exports.decoratePubKey = exports.getFormattedPrice = exports.getPublicKey = exports.writePublicKey = exports.loadWalletKey = exports.chunks = void 0;
const web3_js_1 = require("@solana/web3.js");
const fs_1 = require("fs");
const METADATA_REPLACE = new RegExp("\u0000", "g");
function chunks(array, size) {
    return Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index) => array.slice(index * size, (index + 1) * size));
}
exports.chunks = chunks;
const loadWalletKey = (keypair) => {
    if (!keypair || keypair === "") {
        throw new Error("Keypair is required!");
    }
    const loaded = web3_js_1.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs_1.default.readFileSync(keypair).toString())));
    return loaded;
};
exports.loadWalletKey = loadWalletKey;
const writePublicKey = (publicKey, name) => {
    fs_1.default.writeFileSync(`./keys/${name}_pub.json`, JSON.stringify(publicKey.toString()));
};
exports.writePublicKey = writePublicKey;
const getPublicKey = (name) => new web3_js_1.PublicKey(JSON.parse(fs_1.default.readFileSync(`./keys/${name}_pub.json`)));
exports.getPublicKey = getPublicKey;
const getFormattedPrice = (price) => {
    if (price === undefined)
        return "---";
    let priceStr = price.toString();
    if (priceStr.length < 6)
        return "0";
    let floatStr = priceStr.substring(priceStr.length - 9, priceStr.length);
    if (floatStr.length === 6)
        floatStr = "0.000" + floatStr;
    else if (floatStr.length === 7)
        floatStr = "0.00" + floatStr;
    else if (floatStr.length === 8)
        floatStr = "0.0" + floatStr;
    else if (priceStr.length === 9)
        floatStr = "0." + floatStr;
    else
        floatStr = priceStr.substring(0, priceStr.length - 9) + "." + floatStr;
    let cutIdx = floatStr.length - 1;
    for (; cutIdx >= 0; cutIdx--)
        if (floatStr[cutIdx] !== "0")
            break;
    return floatStr.substring(0, cutIdx + 1);
};
exports.getFormattedPrice = getFormattedPrice;
const decoratePubKey = (key) => {
    let str = key.toBase58();
    let len = str.length;
    return str.substring(0, 5) + "..." + str.substring(len - 5, len);
};
exports.decoratePubKey = decoratePubKey;
class LazyAccountInfoProxy {
    constructor() {
        this.executable = false;
        this.owner = "";
        this.lamports = 0;
    }
    get data() {
        return undefined;
    }
}
exports.LazyAccountInfoProxy = LazyAccountInfoProxy;
const PubKeysInternedMap = new Map();
const toPublicKey = (key) => {
    if (typeof key !== "string") {
        return key;
    }
    let result = PubKeysInternedMap.get(key);
    if (!result) {
        result = new web3_js_1.PublicKey(key);
        PubKeysInternedMap.set(key, result);
    }
    return result;
};
exports.toPublicKey = toPublicKey;
const pubkeyToString = (key = "") => {
    return typeof key === "string" ? key : (key === null || key === void 0 ? void 0 : key.toBase58()) || "";
};
exports.pubkeyToString = pubkeyToString;
exports.WRAPPED_SOL_MINT = new web3_js_1.PublicKey("So11111111111111111111111111111111111111112");
exports.TOKEN_PROGRAM_ID = new web3_js_1.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new web3_js_1.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
exports.BPF_UPGRADE_LOADER_ID = new web3_js_1.PublicKey("BPFLoaderUpgradeab1e11111111111111111111111");
exports.MEMO_ID = new web3_js_1.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
exports.METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
exports.VAULT_ID = "vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn";
exports.AUCTION_ID = "auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8";
exports.METAPLEX_ID = "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98";
exports.SYSTEM = new web3_js_1.PublicKey("11111111111111111111111111111111");
const setProgramIds = async (store) => {
    STORE = store ? (0, exports.toPublicKey)(store) : undefined;
};
exports.setProgramIds = setProgramIds;
let STORE;
const programIds = () => {
    return {
        token: exports.TOKEN_PROGRAM_ID,
        associatedToken: exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        bpf_upgrade_loader: exports.BPF_UPGRADE_LOADER_ID,
        system: exports.SYSTEM,
        metadata: exports.METADATA_PROGRAM_ID,
        memo: exports.MEMO_ID,
        vault: exports.VAULT_ID,
        auction: exports.AUCTION_ID,
        metaplex: exports.METAPLEX_ID,
        store: STORE,
    };
};
exports.programIds = programIds;
//# sourceMappingURL=utils.js.map
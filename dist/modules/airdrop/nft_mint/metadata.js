"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMasterEdition = exports.createMetadata = exports.updateMetadata = exports.getMetadata = exports.METADATA_SCHEMA = exports.Metadata = exports.Data = exports.Creator = exports.Edition = exports.EditionMarker = exports.MasterEditionV2 = exports.MasterEditionV1 = exports.MetadataCategory = exports.MetadataKey = exports.EDITION_MARKER_BIT_SIZE = exports.MAX_EDITION_LEN = exports.MAX_METADATA_LEN = exports.MAX_CREATOR_LEN = exports.MAX_CREATOR_LIMIT = exports.MAX_URI_LENGTH = exports.MAX_SYMBOL_LENGTH = exports.MAX_NAME_LENGTH = exports.RESERVATION = exports.EDITION = exports.METADATA_PREFIX = void 0;
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("./utils");
const borsh_1 = require("borsh");
const borsh_2 = require("./borsh");
(0, borsh_2.extendBorsh)();
const utils_2 = require("./utils");
exports.METADATA_PREFIX = "metadata";
exports.EDITION = "edition";
exports.RESERVATION = "reservation";
exports.MAX_NAME_LENGTH = 32;
exports.MAX_SYMBOL_LENGTH = 10;
exports.MAX_URI_LENGTH = 200;
exports.MAX_CREATOR_LIMIT = 5;
exports.MAX_CREATOR_LEN = 32 + 1 + 1;
exports.MAX_METADATA_LEN = 1 +
    32 +
    32 +
    exports.MAX_NAME_LENGTH +
    exports.MAX_SYMBOL_LENGTH +
    exports.MAX_URI_LENGTH +
    exports.MAX_CREATOR_LIMIT * exports.MAX_CREATOR_LEN +
    2 +
    1 +
    1 +
    198;
exports.MAX_EDITION_LEN = 1 + 32 + 8 + 200;
exports.EDITION_MARKER_BIT_SIZE = 248;
var MetadataKey;
(function (MetadataKey) {
    MetadataKey[MetadataKey["Uninitialized"] = 0] = "Uninitialized";
    MetadataKey[MetadataKey["MetadataV1"] = 4] = "MetadataV1";
    MetadataKey[MetadataKey["EditionV1"] = 1] = "EditionV1";
    MetadataKey[MetadataKey["MasterEditionV1"] = 2] = "MasterEditionV1";
    MetadataKey[MetadataKey["MasterEditionV2"] = 6] = "MasterEditionV2";
    MetadataKey[MetadataKey["EditionMarker"] = 7] = "EditionMarker";
})(MetadataKey = exports.MetadataKey || (exports.MetadataKey = {}));
var MetadataCategory;
(function (MetadataCategory) {
    MetadataCategory["Audio"] = "audio";
    MetadataCategory["Video"] = "video";
    MetadataCategory["Image"] = "image";
    MetadataCategory["VR"] = "vr";
    MetadataCategory["HTML"] = "html";
})(MetadataCategory = exports.MetadataCategory || (exports.MetadataCategory = {}));
class MasterEditionV1 {
    constructor(args) {
        this.key = MetadataKey.MasterEditionV1;
        this.supply = args.supply;
        this.maxSupply = args.maxSupply;
        this.printingMint = args.printingMint;
        this.oneTimePrintingAuthorizationMint =
            args.oneTimePrintingAuthorizationMint;
    }
}
exports.MasterEditionV1 = MasterEditionV1;
class MasterEditionV2 {
    constructor(args) {
        this.key = MetadataKey.MasterEditionV2;
        this.supply = args.supply;
        this.maxSupply = args.maxSupply;
    }
}
exports.MasterEditionV2 = MasterEditionV2;
class EditionMarker {
    constructor(args) {
        this.key = MetadataKey.EditionMarker;
        this.ledger = args.ledger;
    }
    editionTaken(edition) {
        const editionOffset = edition % exports.EDITION_MARKER_BIT_SIZE;
        const indexOffset = Math.floor(editionOffset / 8);
        if (indexOffset > 30) {
            throw Error("bad index for edition");
        }
        const positionInBitsetFromRight = 7 - (editionOffset % 8);
        const mask = Math.pow(2, positionInBitsetFromRight);
        const appliedMask = this.ledger[indexOffset] & mask;
        return appliedMask != 0;
    }
}
exports.EditionMarker = EditionMarker;
class Edition {
    constructor(args) {
        this.key = MetadataKey.EditionV1;
        this.parent = args.parent;
        this.edition = args.edition;
    }
}
exports.Edition = Edition;
class Creator {
    constructor(args) {
        this.address = args.address;
        this.verified = args.verified;
        this.share = args.share;
    }
}
exports.Creator = Creator;
class Data {
    constructor(args) {
        this.name = args.name;
        this.symbol = args.symbol;
        this.uri = args.uri;
        this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
        this.creators = args.creators;
    }
}
exports.Data = Data;
class Metadata {
    constructor(args) {
        var _a;
        this.key = MetadataKey.MetadataV1;
        this.updateAuthority = args.updateAuthority;
        this.mint = args.mint;
        this.data = args.data;
        this.primarySaleHappened = args.primarySaleHappened;
        this.isMutable = args.isMutable;
        this.editionNonce = (_a = args.editionNonce) !== null && _a !== void 0 ? _a : null;
    }
    async init() {
        const metadata = (0, utils_2.toPublicKey)((0, utils_1.programIds)().metadata);
        if (this.editionNonce !== null) {
            this.edition = (await web3_js_1.PublicKey.createProgramAddress([
                Buffer.from(exports.METADATA_PREFIX),
                metadata.toBuffer(),
                (0, utils_2.toPublicKey)(this.mint).toBuffer(),
                new Uint8Array([this.editionNonce || 0]),
            ], metadata)).toBase58();
        }
        else {
        }
        this.masterEdition = this.edition;
    }
}
exports.Metadata = Metadata;
class CreateMetadataArgs {
    constructor(args) {
        this.instruction = 0;
        this.data = args.data;
        this.isMutable = args.isMutable;
    }
}
class UpdateMetadataArgs {
    constructor(args) {
        this.instruction = 1;
        this.data = args.data ? args.data : null;
        this.updateAuthority = args.updateAuthority ? args.updateAuthority : null;
        this.primarySaleHappened = args.primarySaleHappened;
    }
}
class CreateMasterEditionArgs {
    constructor(args) {
        this.instruction = 10;
        this.maxSupply = args.maxSupply;
    }
}
class MintPrintingTokensArgs {
    constructor(args) {
        this.instruction = 9;
        this.supply = args.supply;
    }
}
exports.METADATA_SCHEMA = new Map([
    [
        CreateMetadataArgs,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["data", Data],
                ["isMutable", "u8"],
            ],
        },
    ],
    [
        UpdateMetadataArgs,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["data", { kind: "option", type: Data }],
                ["updateAuthority", { kind: "option", type: "pubkeyAsString" }],
                ["primarySaleHappened", { kind: "option", type: "u8" }],
            ],
        },
    ],
    [
        CreateMasterEditionArgs,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["maxSupply", { kind: "option", type: "u64" }],
            ],
        },
    ],
    [
        MintPrintingTokensArgs,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["supply", "u64"],
            ],
        },
    ],
    [
        MasterEditionV1,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["supply", "u64"],
                ["maxSupply", { kind: "option", type: "u64" }],
                ["printingMint", "pubkeyAsString"],
                ["oneTimePrintingAuthorizationMint", "pubkeyAsString"],
            ],
        },
    ],
    [
        MasterEditionV2,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["supply", "u64"],
                ["maxSupply", { kind: "option", type: "u64" }],
            ],
        },
    ],
    [
        Edition,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["parent", "pubkeyAsString"],
                ["edition", "u64"],
            ],
        },
    ],
    [
        Data,
        {
            kind: "struct",
            fields: [
                ["name", "string"],
                ["symbol", "string"],
                ["uri", "string"],
                ["sellerFeeBasisPoints", "u16"],
                ["creators", { kind: "option", type: [Creator] }],
            ],
        },
    ],
    [
        Creator,
        {
            kind: "struct",
            fields: [
                ["address", "pubkeyAsString"],
                ["verified", "u8"],
                ["share", "u8"],
            ],
        },
    ],
    [
        Metadata,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["updateAuthority", "pubkeyAsString"],
                ["mint", "pubkeyAsString"],
                ["data", Data],
                ["primarySaleHappened", "u8"],
                ["isMutable", "u8"],
            ],
        },
    ],
    [
        EditionMarker,
        {
            kind: "struct",
            fields: [
                ["key", "u8"],
                ["ledger", [31]],
            ],
        },
    ],
]);
async function getMetadata(tokenMint) {
    const PROGRAM_IDS = (0, utils_1.programIds)();
    return (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(exports.METADATA_PREFIX),
        (0, utils_2.toPublicKey)(PROGRAM_IDS.metadata).toBuffer(),
        (0, utils_2.toPublicKey)(tokenMint).toBuffer(),
    ], (0, utils_2.toPublicKey)(PROGRAM_IDS.metadata)))[0].toBase58();
}
exports.getMetadata = getMetadata;
const METADATA_REPLACE = new RegExp("\u0000", "g");
async function updateMetadata(data, newUpdateAuthority, primarySaleHappened, mintKey, updateAuthority, instructions, metadataAccount) {
    const metadataProgramId = (0, utils_1.programIds)().metadata;
    if (metadataAccount === undefined) {
        console.error("metadataAccount is undefined!");
        return;
    }
    const value = new UpdateMetadataArgs({
        data,
        updateAuthority: !newUpdateAuthority ? undefined : newUpdateAuthority,
        primarySaleHappened: primarySaleHappened === null || primarySaleHappened === undefined
            ? null
            : primarySaleHappened,
    });
    const txnData = Buffer.from((0, borsh_1.serialize)(exports.METADATA_SCHEMA, value));
    const keys = [
        {
            pubkey: (0, utils_2.toPublicKey)(metadataAccount),
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: (0, utils_2.toPublicKey)(updateAuthority),
            isSigner: true,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: (0, utils_2.toPublicKey)(metadataProgramId),
        data: txnData,
    }));
    return metadataAccount;
}
exports.updateMetadata = updateMetadata;
async function createMetadata(data, updateAuthority, mintKey, mintAuthorityKey, instructions, payer) {
    const metadataProgramId = (0, utils_1.programIds)().metadata;
    const metadataAccount = (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from("metadata"),
        (0, utils_2.toPublicKey)(metadataProgramId).toBuffer(),
        (0, utils_2.toPublicKey)(mintKey).toBuffer(),
    ], (0, utils_2.toPublicKey)(metadataProgramId)))[0];
    const value = new CreateMetadataArgs({ data, isMutable: true });
    const txnData = Buffer.from((0, borsh_1.serialize)(exports.METADATA_SCHEMA, value));
    const keys = [
        {
            pubkey: (0, utils_2.toPublicKey)(metadataAccount),
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: (0, utils_2.toPublicKey)(mintKey),
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: (0, utils_2.toPublicKey)(mintAuthorityKey),
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: (0, utils_2.toPublicKey)(payer),
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: (0, utils_2.toPublicKey)(updateAuthority),
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: (0, utils_2.toPublicKey)(metadataProgramId),
        data: txnData,
    }));
    return metadataAccount;
}
exports.createMetadata = createMetadata;
async function createMasterEdition(maxSupply, mintKey, updateAuthorityKey, mintAuthorityKey, payer, instructions) {
    const metadataProgramId = (0, utils_1.programIds)().metadata;
    const metadataAccount = (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(exports.METADATA_PREFIX),
        (0, utils_2.toPublicKey)(metadataProgramId).toBuffer(),
        (0, utils_2.toPublicKey)(mintKey).toBuffer(),
    ], (0, utils_2.toPublicKey)(metadataProgramId)))[0];
    const editionAccount = (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(exports.METADATA_PREFIX),
        (0, utils_2.toPublicKey)(metadataProgramId).toBuffer(),
        (0, utils_2.toPublicKey)(mintKey).toBuffer(),
        Buffer.from(exports.EDITION),
    ], (0, utils_2.toPublicKey)(metadataProgramId)))[0];
    const value = new CreateMasterEditionArgs({ maxSupply: maxSupply || null });
    const data = Buffer.from((0, borsh_1.serialize)(exports.METADATA_SCHEMA, value));
    const keys = [
        {
            pubkey: (0, utils_2.toPublicKey)(editionAccount),
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: (0, utils_2.toPublicKey)(mintKey),
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: (0, utils_2.toPublicKey)(updateAuthorityKey),
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: (0, utils_2.toPublicKey)(mintAuthorityKey),
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: (0, utils_2.toPublicKey)(payer),
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: (0, utils_2.toPublicKey)(metadataAccount),
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: (0, utils_1.programIds)().token,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: (0, utils_2.toPublicKey)(metadataProgramId),
        data,
    }));
}
exports.createMasterEdition = createMasterEdition;
//# sourceMappingURL=metadata.js.map
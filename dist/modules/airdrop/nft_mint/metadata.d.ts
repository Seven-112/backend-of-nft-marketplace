import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { StringPublicKey } from "./utils";
export declare const METADATA_PREFIX = "metadata";
export declare const EDITION = "edition";
export declare const RESERVATION = "reservation";
export declare const MAX_NAME_LENGTH = 32;
export declare const MAX_SYMBOL_LENGTH = 10;
export declare const MAX_URI_LENGTH = 200;
export declare const MAX_CREATOR_LIMIT = 5;
export declare const MAX_CREATOR_LEN: number;
export declare const MAX_METADATA_LEN: number;
export declare const MAX_EDITION_LEN: number;
export declare const EDITION_MARKER_BIT_SIZE = 248;
export declare enum MetadataKey {
    Uninitialized = 0,
    MetadataV1 = 4,
    EditionV1 = 1,
    MasterEditionV1 = 2,
    MasterEditionV2 = 6,
    EditionMarker = 7
}
export declare enum MetadataCategory {
    Audio = "audio",
    Video = "video",
    Image = "image",
    VR = "vr",
    HTML = "html"
}
export declare type MetadataFile = {
    uri: string;
    type: string;
};
export declare type FileOrString = MetadataFile | string;
export declare type Attribute = {
    trait_type?: string;
    display_type?: string;
    value: string | number;
};
export interface IMetadataExtension {
    name: string;
    symbol: string;
    creators: Creator[] | null;
    description: string;
    image: string;
    animation_url?: string;
    attributes?: Attribute[];
    external_url: string;
    seller_fee_basis_points: number;
    properties: {
        files?: FileOrString[];
        category: MetadataCategory;
        maxSupply?: number;
        creators?: {
            address: string;
            shares: number;
        }[];
    };
}
export declare class MasterEditionV1 {
    key: MetadataKey;
    supply: BN;
    maxSupply?: BN;
    printingMint: StringPublicKey;
    oneTimePrintingAuthorizationMint: StringPublicKey;
    constructor(args: {
        key: MetadataKey;
        supply: BN;
        maxSupply?: BN;
        printingMint: StringPublicKey;
        oneTimePrintingAuthorizationMint: StringPublicKey;
    });
}
export declare class MasterEditionV2 {
    key: MetadataKey;
    supply: BN;
    maxSupply?: BN;
    constructor(args: {
        key: MetadataKey;
        supply: BN;
        maxSupply?: BN;
    });
}
export declare class EditionMarker {
    key: MetadataKey;
    ledger: number[];
    constructor(args: {
        key: MetadataKey;
        ledger: number[];
    });
    editionTaken(edition: number): boolean;
}
export declare class Edition {
    key: MetadataKey;
    parent: StringPublicKey;
    edition: BN;
    constructor(args: {
        key: MetadataKey;
        parent: StringPublicKey;
        edition: BN;
    });
}
export declare class Creator {
    address: StringPublicKey;
    verified: boolean;
    share: number;
    constructor(args: {
        address: StringPublicKey;
        verified: boolean;
        share: number;
    });
}
export declare class Data {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: Creator[] | null;
    constructor(args: {
        name: string;
        symbol: string;
        uri: string;
        sellerFeeBasisPoints: number;
        creators: Creator[] | null;
    });
}
export declare class Metadata {
    key: MetadataKey;
    updateAuthority: StringPublicKey;
    mint: StringPublicKey;
    data: Data;
    primarySaleHappened: boolean;
    isMutable: boolean;
    editionNonce: number | null;
    masterEdition?: StringPublicKey;
    edition?: StringPublicKey;
    constructor(args: {
        updateAuthority: StringPublicKey;
        mint: StringPublicKey;
        data: Data;
        primarySaleHappened: boolean;
        isMutable: boolean;
        editionNonce: number | null;
    });
    init(): Promise<void>;
}
export declare const METADATA_SCHEMA: Map<any, any>;
export declare function getMetadata(tokenMint: StringPublicKey): Promise<StringPublicKey>;
export declare function updateMetadata(data: Data | undefined, newUpdateAuthority: string | undefined, primarySaleHappened: boolean | null | undefined, mintKey: StringPublicKey, updateAuthority: StringPublicKey, instructions: TransactionInstruction[], metadataAccount?: StringPublicKey): Promise<string>;
export declare function createMetadata(data: Data, updateAuthority: StringPublicKey, mintKey: StringPublicKey, mintAuthorityKey: StringPublicKey, instructions: TransactionInstruction[], payer: StringPublicKey): Promise<PublicKey>;
export declare function createMasterEdition(maxSupply: BN | undefined, mintKey: StringPublicKey, updateAuthorityKey: StringPublicKey, mintAuthorityKey: StringPublicKey, payer: StringPublicKey, instructions: TransactionInstruction[]): Promise<void>;

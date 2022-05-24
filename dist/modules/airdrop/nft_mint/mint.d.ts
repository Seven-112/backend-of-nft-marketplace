import { PublicKey } from "@solana/web3.js";
export declare const mintNewNFT: (name: string, symbol: string, metadataUrl: string, ownerPubkey: string) => Promise<Array<PublicKey>>;

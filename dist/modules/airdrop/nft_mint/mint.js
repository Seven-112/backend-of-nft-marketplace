"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintNewNFT = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
let bs58 = require("bs58");
const bn_js_1 = require("bn.js");
const metadata_1 = require("./metadata");
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"));
const creator = web3_js_1.Keypair.generate();
const mintNewNFT = async (name, symbol, metadataUrl, ownerPubkey) => {
    const newMintKey = await (0, spl_token_1.createMint)(connection, creator, creator.publicKey, null, 0);
    const nftAccount = await (0, spl_token_1.createAccount)(connection, creator, newMintKey, new web3_js_1.PublicKey(ownerPubkey));
    await (0, spl_token_1.mintTo)(connection, creator, newMintKey, nftAccount, creator, 1);
    const creators = [
        new metadata_1.Creator({
            address: creator.publicKey.toBase58(),
            share: 37,
            verified: true,
        }),
        new metadata_1.Creator({
            address: "7diGCKfWSnqujiC9GvK3mpwsF5421644SbDEHKtSho1d",
            share: 60,
            verified: false,
        }),
        new metadata_1.Creator({
            address: "GC9Ln3MRWahCrgjdtRANZyF5vpVd9XWgJibJsuNUXWLB",
            share: 3,
            verified: false,
        }),
    ];
    let data = new metadata_1.Data({
        name,
        symbol,
        uri: metadataUrl,
        creators,
        sellerFeeBasisPoints: 800,
    });
    let instructions = [];
    await (0, metadata_1.createMetadata)(data, creator.publicKey.toBase58(), newMintKey.toBase58(), creator.publicKey.toBase58(), instructions, creator.publicKey.toBase58());
    await (0, metadata_1.createMasterEdition)(new bn_js_1.default(1), newMintKey.toBase58(), creator.publicKey.toBase58(), creator.publicKey.toBase58(), creator.publicKey.toBase58(), instructions);
    const transaction = new web3_js_1.Transaction();
    transaction.add(...instructions);
    let txHash = await (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [creator]);
    return [nftAccount, newMintKey];
};
exports.mintNewNFT = mintNewNFT;
//# sourceMappingURL=mint.js.map
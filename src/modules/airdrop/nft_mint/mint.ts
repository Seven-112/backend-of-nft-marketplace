
import {
  Keypair,
  PublicKey,
  Connection,
  clusterApiUrl,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

// for rest function
import {
  TOKEN_PROGRAM_ID,
  AccountLayout,
  MintLayout,
  createMint,
  createAccount,
  mintTo,
} from "@solana/spl-token";

let bs58 = require("bs58");
const BN = require("bn.js");

import {
  Data,
  updateMetadata,
  Creator,
  createMetadata,
  createMasterEdition,
  getMetadata,
} from "./metadata";

const connection = new Connection(clusterApiUrl("devnet"));

// J2TQr6JnPSQokyYUSSmWzniYxmRnGkQFJEQ4gQi3xfnU
const creator = Keypair.fromSecretKey(bs58.decode("4ZLWCqCpcxBRwDA9RbKHWpHUW5zSTsRzMj42YqiR67Fg2LJeZMTGq1XpLniJmEUky1rUGwJR9MtyKEFTgstV9Lax"));

export const mintNewNFT = async (
  name: string,
  symbol: string,
  metadataUrl: string,
  ownerPubkey: string
): Promise<Array<PublicKey>> => {
  console.log("mintNewNFT ;", name, symbol, metadataUrl, ownerPubkey);
  // Create new token mint
  const newMintKey = await createMint(
    connection,
    creator,
    creator.publicKey,
    null,
    0
  );
  // todo: modify to createAssociatedAccount
  const nftAccount = await createAccount(
    connection,
    creator,
    newMintKey,
    new PublicKey(ownerPubkey)
  );
  await mintTo(
    connection,
    creator,
    newMintKey,
    nftAccount,
    creator,
    1
  );
  console.log("mintTo done tokenAccount =", nftAccount.toBase58());
  const creators = [
    new Creator({
      address: creator.publicKey.toBase58(),
      share: 100,
      verified: true,
    }),
  ];

  let data = new Data({
    name,
    symbol,
    uri: metadataUrl,
    creators,
    sellerFeeBasisPoints: 800,
  });

  let instructions: TransactionInstruction[] = [];

  const metadataKey = await createMetadata(
    data,
    creator.publicKey.toBase58(),
    newMintKey.toBase58(),
    creator.publicKey.toBase58(),
    instructions,
    creator.publicKey.toBase58()
  );
  console.log("createMetadata ix adding done metadataKey =", metadataKey.toBase58());

  await createMasterEdition(
    new BN(1),
    newMintKey.toBase58(),
    creator.publicKey.toBase58(),
    creator.publicKey.toBase58(),
    creator.publicKey.toBase58(),
    instructions
  );
  console.log("createMasterEdition ix adding done");
  const transaction = new Transaction();
  transaction.add(...instructions);
  let txHash = await sendAndConfirmTransaction(
    connection,
    transaction,
    [creator]
  );
  console.log("all done: newMint =", newMintKey.toBase58());
  return [nftAccount, newMintKey];
};

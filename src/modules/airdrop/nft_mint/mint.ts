
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
import BN from "bn.js";
import {
  Data,
  updateMetadata,
  Creator,
  createMetadata,
  createMasterEdition,
  getMetadata,
} from "./metadata";

const connection = new Connection(clusterApiUrl("devnet"));

const creator = Keypair.generate();

export const mintNewNFT = async (
  name: string,
  symbol: string,
  metadataUrl: string,
  ownerPubkey: string
): Promise<Array<PublicKey>> => {
  // Create new token mint
  const newMintKey = await createMint(
    connection,
    creator,
    creator.publicKey,
    null,
    0
  );
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

  const creators = [
    new Creator({
      address: creator.publicKey.toBase58(),
      share: 37,
      verified: true,
    }),
    new Creator({
      address: "7diGCKfWSnqujiC9GvK3mpwsF5421644SbDEHKtSho1d",
      share: 60,
      verified: false,
    }),
    new Creator({
      address: "GC9Ln3MRWahCrgjdtRANZyF5vpVd9XWgJibJsuNUXWLB",
      share: 3,
      verified: false,
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

  await createMetadata(
    data,
    creator.publicKey.toBase58(),
    newMintKey.toBase58(),
    creator.publicKey.toBase58(),
    instructions,
    creator.publicKey.toBase58()
  );

  await createMasterEdition(
    new BN(1),
    newMintKey.toBase58(),
    creator.publicKey.toBase58(),
    creator.publicKey.toBase58(),
    creator.publicKey.toBase58(),
    instructions
  );
  const transaction = new Transaction();
  transaction.add(...instructions);
  let txHash = await sendAndConfirmTransaction(
    connection,
    transaction,
    [creator]
  );
  return [nftAccount, newMintKey];
};

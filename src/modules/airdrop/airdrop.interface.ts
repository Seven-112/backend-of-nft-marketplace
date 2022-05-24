
export class User {
  name: string;
  email: string;
  wallet: string;
  nftCount: number;
  userStatus: boolean;
}

export class AirdropStatus {
  // totally airdropped nft count
  totalNftNumber: number;
  // current user id
  curUserId: number;
  // current user's airdropped nft count
  curUserNftNumber: number;

  constructor(
    pTotalNftNumber,
    pCurUserId,
    pCurUserNftNumber
  ) {
    this.totalNftNumber = pTotalNftNumber;
    this.curUserId = pCurUserId;
    this.curUserNftNumber = pCurUserNftNumber;
  }

  toString() {
    return this.totalNftNumber + ";" 
            + this.curUserId + ";" 
            + this.curUserNftNumber;
  }

  static fromString(str: string) {
    const tokens = str.split(';');
    return new AirdropStatus(
      parseInt(tokens[0]),
      parseInt(tokens[1]),
      parseInt(tokens[2]),
    )
  }
}
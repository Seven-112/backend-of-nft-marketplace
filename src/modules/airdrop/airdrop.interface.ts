
export class User {
  username: string;
  email: string;
  walletAddress: string;
  status: string;
  nftCount: number;
}

export class AirdropStatus {
  // totally airdropped nft count
  airdroppedCount: number;
  status: string;

  constructor(
    pTotalNftNumber = 0,
    pStatus = "none"
  ) {
    this.airdroppedCount = pTotalNftNumber;
    this.status = pStatus;
  }

  toString() {
    return this.airdroppedCount + ";" 
            + this.status;
  }

  setStateToDoing() {
    this.status = "doing";
  }

  setStateToDone() {
    this.status = "done";
  }

  isAble() {
    return this.status === 'none';
  }

  static fromString(str: string) {
    if (str === "") return new AirdropStatus();
    const tokens = str.split(';');
    return new AirdropStatus(
      parseInt(tokens[0]),
      tokens[1]
    )
  }


}
export enum UserRole {
  Admin = 'admin',
  Creator = 'creator',
  User = 'user',
}

export enum UserStatus {
  active = 'active',
  banned = 'banned',
  freeze = 'freeze',
  nft_owner = 'nft owner',
}
export interface User {
  id: string;
  walletAddress?: string;
  email: string;
  username: string;
  job: string;
  personalWebsite: string;
  phoneNumber: string;
  timezone: string;
  avatar: string;
  role: string;
  status: string;
  createdAt: string;
}

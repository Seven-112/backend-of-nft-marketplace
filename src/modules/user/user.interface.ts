export enum UserRole {
  Admin = 'admin',
  Creator = 'creator',
  User = 'user',
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
}

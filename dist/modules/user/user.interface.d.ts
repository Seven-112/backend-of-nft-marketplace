export declare enum UserRole {
    Admin = "admin",
    Creator = "creator",
    User = "user"
}
export declare enum UserStatus {
    active = "active",
    banned = "banned",
    freeze = "freeze",
    nft_owner = "nft owner"
}
export declare class Social {
    youtube?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    discord?: string;
    telegram?: string;
}
export declare class User {
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
    social?: Social;
}

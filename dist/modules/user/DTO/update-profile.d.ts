export declare class SocialDTO {
    youtube?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    discord?: string;
    telegram?: string;
}
export declare class UpdateProfileDTO {
    username?: string;
    job?: string;
    personalWebsite?: string;
    phoneNumber?: string;
    timezone?: string;
    avatar?: string;
    social?: SocialDTO;
}
export declare class UpdateSocialDTO {
    social?: SocialDTO;
}
export declare class UpdatePasswordDTO {
    oldPassword: string;
    newPassword: string;
}

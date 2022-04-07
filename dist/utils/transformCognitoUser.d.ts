import { CognitoIdentityServiceProvider } from 'aws-sdk';
export declare const transformCognitoUser: (data: CognitoIdentityServiceProvider.GetUserResponse) => {
    username: string;
};

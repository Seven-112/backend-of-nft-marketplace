import { CognitoIdentityServiceProvider } from 'aws-sdk';

export const transformCognitoUser = (
  data: CognitoIdentityServiceProvider.GetUserResponse,
) => {
  const result = {
    username: data.Username,
  };

  return data.UserAttributes.reduce(
    (acc, val) => ({
      ...acc,
      [val.Name]: val.Value,
    }),
    result,
  );
};

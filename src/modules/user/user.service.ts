import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User } from './user.interface';
import * as aws from 'aws-sdk';
import { transformCognitoUser } from 'src/utils/transformCognitoUser';
import { SortOrder } from 'dynamoose/dist/General';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User, User['id']>,
  ) {}

  async isWalletAvailable(address: string) {
    const user = await this.userModel.scan('walletAddress').eq(address).exec();

    return !user.count;
  }

  async isUserAvailable(id: string) {
    const user = await this.userModel.get(id);

    return !user;
  }

  async getUserById(id: string) {
    return this.userModel.get(id);
  }

  async getUserByIdOrWallet(id: string) {
    return this.userModel
      .scan('id')
      .eq(id)
      .or()
      .where('walletAddress')
      .eq(id)
      .exec();
  }

  async createUser(data: User) {
    return this.userModel.create(data);
  }

  async getUserByUsername(username: string) {
    return this.userModel.scan('username').eq(username).exec();
  }

  async getByWalletAddress(address: string) {
    return this.userModel.scan('walletAddress').eq(address).exec();
  }

  async getUserByWalletAddressOrId(key: string) {
    const userByWallet = await this.userModel.get(key);

    if (userByWallet) return userByWallet;

    const users = await this.userModel.scan('walletAddress').eq(key).exec();

    return users[0] || null;
  }

  async getByEmail(email: string) {
    return this.userModel.scan('email').eq(email).exec();
  }

  async updateUser(user: User) {
    return this.userModel.update(user);
  }

  async updateWalletAddress(id: string, body: any) {
    body.id = id;
    return this.userModel.update(body);
  }

  async getUsers(ids: string[]) {
    return this.userModel
      .scan('id')
      .in(ids)
      .or()
      .where('walletAddress')
      .in(ids)
      .exec();
  }

  async getAllUsers(limit?: number) {
    if (limit)
      return this.userModel
        .scan('deletedAt')
        .not()
        .exists()
        .limit(limit)
        .exec();

    return this.userModel.scan('deletedAt').not().exists().exec();
  }

  async getUserFromCognito(accessToken: string) {
    // const params = {
    //   UserPoolId: process.env.USER_POOL_ID,
    //   AttributesToGet: ['email'],
    // };

    const cognitoIdentityServiceProvider =
      new aws.CognitoIdentityServiceProvider();

    return new Promise((resolve, reject) => {
      cognitoIdentityServiceProvider.getUser(
        { AccessToken: accessToken },
        function (error, data) {
          if (error) {
            reject(error);
          }

          if (!data) {
            // throw new ForbiddenException();

            return resolve({});
          }

          resolve(transformCognitoUser(data));
        },
      );
    });

    // cognitoIdentityServiceProvider.listUsers(params, (err, data) => {
    //   console.log(err, data);
    // });
  }

  async changePassword(
    data: aws.CognitoIdentityServiceProvider.ChangePasswordRequest,
  ) {
    const cognitoIdentityServiceProvider =
      new aws.CognitoIdentityServiceProvider();

    return new Promise((resolve, reject) => {
      cognitoIdentityServiceProvider.changePassword(
        data,
        function (err, response) {
          if (err) {
            reject(err);
          }

          resolve(response);
        },
      );
    });
  }

  async searchUsers(address: string) {
    return this.userModel
      .scan('walletAddress')
      .contains(address)
      .or()
      .where('username')
      .contains(address)
      .or()
      .where('email')
      .contains(address)
      .exec();
  }

  async getUserByEmail(email: string) {
    return this.userModel.scan('email').eq(email).exec();
  }

  async disableUserCognito(email: string) {
    const cognitoIdentityServiceProvider =
      new aws.CognitoIdentityServiceProvider();

    await cognitoIdentityServiceProvider.adminDisableUser(
      {
        Username: email,
        UserPoolId: 'eu-west-2_xi1EqOokH',
      },
      (error, response) => {
        console.log(error, response);
      },
    );
  }

  async enableUserCognito(email: string) {
    const cognitoIdentityServiceProvider =
      new aws.CognitoIdentityServiceProvider();

    await cognitoIdentityServiceProvider.adminEnableUser(
      {
        Username: email,
        UserPoolId: 'eu-west-2_xi1EqOokH',
      },
      (error, response) => {
        console.log(error, response);
      },
    );
  }

  async getDataByTime(startTime: number, endTime: number) {
    return this.userModel
      .scan('createdAt')
      .ge(startTime)
      .and()
      .where('createdAt')
      .le(endTime)
      .exec();
  }
}

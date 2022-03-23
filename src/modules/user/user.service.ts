import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User } from './user.interface';
import * as aws from 'aws-sdk';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, User['id']>,
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

  async createUser(data: User) {
    return this.userModel.create(data);
  }

  async getUserByUsername(username: string) {
    return this.userModel.scan('username').eq(username).exec();
  }

  async getByWalletAddress(address: string) {
    return this.userModel.scan('walletAddress').eq(address).exec();
  }

  async updateUser(user: User) {
    return this.userModel.update(user);
  }

  async getUsers(ids: string[]) {
    return this.userModel.batchGet(ids);
  }

  async test() {
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      AttributesToGet: ['email'],
    };

    const cognitoIdentityServiceProvider =
      new aws.CognitoIdentityServiceProvider();

    cognitoIdentityServiceProvider.listUsers(params, (err, data) => {
      console.log(err, data);
    });
  }

  async searchUsers(address: string) {
    return this.userModel.scan('walletAddress').contains(address).exec();
  }
}

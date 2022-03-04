import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User } from './user.interface';

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

  async createUser(data: User) {
    return this.userModel.create(data);
  }

  async getByWalletAddress(address: string) {
    return this.userModel.scan('walletAddress').eq(address).exec();
  }

  async updateUser(id: string, walletAddress: string) {
    return this.userModel.update(id, { walletAddress });
  }
}

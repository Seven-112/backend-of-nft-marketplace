import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User } from './users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, User['id']>,
  ) {}

  // async findOne(username: string): Promise<User | undefined> {
  //   return this.users.find((user) => user.username === username);
  // }

  async isUsernameAvailable(username: string) {
    const user = await this.userModel
      .query({
        username: {
          eq: username,
        },
      })
      .limit(1)
      .exec();

    if (user.length) {
      return false;
    }

    return true;
  }

  async isEmailAvailable(email: string) {
    const user = await this.userModel
      .scan({
        email: {
          eq: email,
        },
      })
      .limit(1)
      .exec();

    if (user.length) {
      return false;
    }

    return true;
  }

  async create(user: User): Promise<User> {
    return await this.userModel.create(user);
  }

  async findAll() {
    return await this.userModel.scan().exec();
  }
}

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
      .scan({
        username: {
          eq: username,
        },
      })
      .limit(1)
      .exec();

    return !!user.length;
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

    return !!user.length;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel
      .scan({
        email: {
          eq: email,
        },
      })
      .limit(1)
      .exec();
    return user.length ? user[0] : null;
  }

  async create(user: User): Promise<User> {
    return this.userModel.create(user);
  }

  async findAll() {
    return this.userModel.scan().exec();
  }

  async findById(id: string) {
    return this.userModel
      .query({
        id: {
          eq: id,
        },
      })
      .exec();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, User['id']>,
  ) {}

  async isUsernameAvailable(username: string) {
    const user = await this.userModel
      .scan({
        username: {
          eq: username,
        },
      })
      .limit(1)
      .exec();
    return !user.count;
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

    return !user.count;
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

    return user.count ? user[0] : null;
  }

  async create(user: User): Promise<User> {
    const created = await this.userModel.create(user);
    return created;
  }

  async findAll() {
    return this.userModel.scan().exec();
  }

  async findById(id: string) {
    return this.userModel.get(id);
  }
}

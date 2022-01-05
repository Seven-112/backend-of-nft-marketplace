import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User } from './user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, User['id']>,
  ) {}

  async isUsernameAvailable(username: string) {
    const user = await this.userModel
      .query('username')
      .eq(username)
      .limit(1)
      .exec();

    return !user.count;
  }

  async updatePassword(id: string, password: string) {
    return this.userModel.update(id, { password });
  }

  async isEmailAvailable(email: string) {
    const user = await this.userModel.query('email').eq(email).limit(1).exec();

    return !user.count;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.query('email').eq(email).limit(1).exec();

    return user.count ? user[0] : null;
  }

  async create(user: User): Promise<User> {
    return this.userModel.create(user);
  }

  async findAll() {
    return this.userModel.scan().exec();
  }

  async findById(id: string) {
    return this.userModel.get(id);
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}

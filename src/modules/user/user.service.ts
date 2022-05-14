import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User } from './user.interface';
import * as aws from 'aws-sdk';
import { transformCognitoUser } from 'src/utils/transformCognitoUser';
import { SortOrder } from 'dynamoose/dist/General';
import { RedisService } from '../redis/redis.service';
import { Caching } from 'src/utils/caching';
import getFirstTruthy from 'src/utils/getFirstTruthy';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User, User['id']>,
    private readonly redisService: RedisService,
  ) {}

  async clear() {
    Promise.all(
      this.redisService.delWithPrefix(
        Caching.ALL_USER,
        Caching.SEARCH_USER,
        Caching.USER_BY_EMAIL,
        Caching.USER_BY_ID,
        Caching.USER_BY_IDS,
        Caching.USER_BY_USERNAME,
        Caching.USER_BY_WALLET_ADDRESS,
        Caching.USER_BY_TIME,
      ),
    );

    return;
  }

  async isWalletAvailable(address: string) {
    const cached = await this.redisService.getWithPrefix(
      Caching.USER_BY_WALLET_ADDRESS,
      address,
    );

    if (cached) {
      return false;
    }

    const user = await this.userModel.scan('walletAddress').eq(address).exec();

    if (user.length) {
      this.redisService.setWithPrefix(
        Caching.USER_BY_WALLET_ADDRESS,
        address,
        JSON.stringify(user),
      );
    }

    return !user.length;
  }

  async isUserAvailable(id: string) {
    const cached = await this.redisService.getWithPrefix(
      Caching.USER_BY_ID,
      id,
    );

    if (cached) {
      return false;
    }

    const user = await this.userModel.get(id);

    if (user) {
      this.redisService.setWithPrefix(
        Caching.USER_BY_ID,
        id,
        JSON.stringify(user),
      );
    }

    return !user;
  }

  async getUserById(id: string) {
    const cached = await this.redisService.getWithPrefix(
      Caching.USER_BY_ID,
      id,
    );
    if (cached) {
      return JSON.parse(cached);
    }

    const user = await this.userModel.get(id);

    if (user) {
      this.redisService.setWithPrefix(
        Caching.USER_BY_ID,
        id,
        JSON.stringify(user),
      );
    }

    return user;
  }

  async getUserByIdOrWallet(id: string) {
    const cached = await Promise.all([
      this.redisService.getWithPrefix(Caching.USER_BY_ID, id),
      this.redisService.getWithPrefix(Caching.USER_BY_WALLET_ADDRESS, id),
    ]);

    const value = getFirstTruthy(cached);

    if (value) {
      return JSON.parse(value);
    }

    const user = await this.userModel
      .scan('id')
      .eq(id)
      .or()
      .where('walletAddress')
      .eq(id)
      .exec();

    if (user.length) {
      Promise.all([
        this.redisService.setWithPrefix(
          Caching.USER_BY_ID,
          id,
          JSON.stringify(user),
        ),
        this.redisService.setWithPrefix(
          Caching.USER_BY_WALLET_ADDRESS,
          id,
          JSON.stringify(user),
        ),
      ]);
    }

    return user;
  }

  async getUserByUsername(username: string) {
    const cached = await this.redisService.getWithPrefix(
      Caching.USER_BY_USERNAME,
      username,
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const user = await this.userModel.scan('username').eq(username).exec();

    if (user.length) {
      this.redisService.setWithPrefix(
        Caching.USER_BY_USERNAME,
        username,
        JSON.stringify(user),
      );
    }

    return user;
  }

  async getByWalletAddress(address: string) {
    const cached = await this.redisService.getWithPrefix(
      Caching.USER_BY_WALLET_ADDRESS,
      address,
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const user = await this.userModel.scan('walletAddress').eq(address).exec();

    if (user.length) {
      this.redisService.setWithPrefix(
        Caching.USER_BY_WALLET_ADDRESS,
        address,
        JSON.stringify(user),
      );
    }

    return user;
  }

  async getUserByWalletAddressOrId(key: string) {
    const cached = await Promise.all([
      this.redisService.getWithPrefix(Caching.USER_BY_ID, key),
      this.redisService.getWithPrefix(Caching.USER_BY_WALLET_ADDRESS, key),
    ]);

    const value = getFirstTruthy(cached);

    if (value) {
      return JSON.parse(value);
    }

    const userById = await this.userModel.get(key);

    if (userById) {
      this.redisService.setWithPrefix(
        Caching.USER_BY_ID,
        key,
        JSON.stringify(userById),
      );

      return userById;
    }

    const users = await this.userModel.scan('walletAddress').eq(key).exec();

    if (users.length) {
      this.redisService.setWithPrefix(
        Caching.USER_BY_WALLET_ADDRESS,
        key,
        JSON.stringify(users[0]),
      );
    }

    return users[0] || null;
  }

  async getByEmail(email: string) {
    const cached = await this.redisService.getWithPrefix(
      Caching.USER_BY_EMAIL,
      email,
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const user = await this.userModel.scan('email').eq(email).exec();

    if (user.length) {
      this.redisService.setWithPrefix(
        Caching.USER_BY_EMAIL,
        email,
        JSON.stringify(user),
      );
    }

    return user;
  }

  async updateUser(user: User) {
    this.clear();
    return this.userModel.update(user);
  }

  async updateWalletAddress(id: string, body: any) {
    body.id = id;
    this.clear();
    return this.userModel.update(body);
  }

  async getUsers(ids: string[]) {
    const cached = await this.redisService.getWithPrefix(
      Caching.USER_BY_IDS,
      ids.join(','),
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const users = await this.userModel
      .scan('id')
      .in(ids)
      .or()
      .where('walletAddress')
      .in(ids)
      .exec();

    if (users.length) {
      this.redisService.setWithPrefix(
        Caching.USER_BY_IDS,
        ids.join(','),
        JSON.stringify(users),
      );
    }

    return users;
  }

  async getAllUsers(limit?: number) {
    if (limit) {
      const cached = await this.redisService.getWithPrefix(
        Caching.ALL_USER,
        '' + limit,
      );

      if (cached) {
        return JSON.parse(cached);
      }

      const user = await this.userModel
        .scan('deletedAt')
        .not()
        .exists()
        .limit(limit)
        .exec();

      if (user.length) {
        this.redisService.setWithPrefix(
          Caching.ALL_USER,
          '' + limit,
          JSON.stringify(user),
        );
      }

      return user;
    }

    const cached = await this.redisService.getWithPrefix(Caching.ALL_USER, '');

    if (cached) {
      return JSON.parse(cached);
    }

    const user = await this.userModel.scan('deletedAt').not().exists().exec();

    if (user.length) {
      this.redisService.setWithPrefix(
        Caching.ALL_USER,
        '',
        JSON.stringify(user),
      );
    }

    return user;
  }

  async getUserFromCognito(accessToken: string) {
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
    const cached = await this.redisService.getWithPrefix(
      Caching.SEARCH_USER,
      address,
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const user = await this.userModel
      .scan('walletAddress')
      .contains(address)
      .or()
      .where('username')
      .contains(address)
      .or()
      .where('email')
      .contains(address)
      .exec();

    if (user.length) {
      this.redisService.setWithPrefix(
        Caching.SEARCH_USER,
        address,
        JSON.stringify(user),
      );
    }

    return user;
  }

  async getUserByEmail(email: string) {
    const cached = await this.redisService.getWithPrefix(
      Caching.USER_BY_EMAIL,
      email,
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const user = await this.userModel.scan('email').eq(email).exec();

    if (user.length) {
      this.redisService.setWithPrefix(
        Caching.USER_BY_EMAIL,
        email,
        JSON.stringify(user),
      );
    }

    return user;
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
    const cached = await this.redisService.getWithPrefix(
      Caching.USER_BY_TIME,
      startTime.toString() + ',' + endTime.toString(),
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const user = await this.userModel
      .scan('createdAt')
      .ge(startTime)
      .and()
      .where('createdAt')
      .le(endTime)
      .exec();

    if (user.length) {
      this.redisService.setWithPrefix(
        Caching.USER_BY_TIME,
        startTime.toString() + ',' + endTime.toString(),
        JSON.stringify(user),
      );
    }

    return user;
  }
}

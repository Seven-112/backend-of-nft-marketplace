import { User } from '../user/user.interface';

export class Watchlist {
  id: string;
  list: string[];
  users?: User[];
}

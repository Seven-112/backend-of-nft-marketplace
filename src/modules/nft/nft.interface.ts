import { nanoid } from 'nanoid';

export class Nft {
  id: string;
  title: string;
  owner: string;
  price?: number;
  usdPrice?: number;
  createdAt: number;
  updatedAt: number;
  imgLink: string;
  metadataPubkey: string;
}

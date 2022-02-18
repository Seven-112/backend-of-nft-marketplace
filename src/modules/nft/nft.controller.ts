import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { Public } from 'src/guard/jwt-auth.guard';

const SAMPLE_DATA = [
  {
    id: '1RVoIdac62lw3fObHTqG',
    name: 'Sample NFT 1',
    coinPrice: 123.55,
    usdPrice: 845.55,
    forSale: true,
    metadata: {
      size: 1,
    },
  },
  {
    id: 'EvbeDyZ8rCgJc9wIhFio',
    name: 'Sample NFT 2',
    coinPrice: 123.55,
    usdPrice: 845.55,
    forSale: true,
    metadata: {
      size: 2,
    },
  },
  {
    id: 'sRBlzh463WpY5OogqSvP',
    name: 'Sample NFT 3',
    forSale: false,
    coinPrice: 123.55,
    usdPrice: 845.55,
    metadata: {
      size: 3,
    },
  },
  {
    id: 'weWgMt6HNryGbvAkOp21',
    name: 'Sample NFT 4',
    forSale: true,
    coinPrice: 123.55,
    usdPrice: 845.55,
    metadata: {
      size: 4,
    },
  },
  {
    id: '1RVoIdac62lw3fObHT2G',
    name: 'Sample NFT 5',
    forSale: true,
    coinPrice: 123.55,
    usdPrice: 845.55,
    metadata: {
      size: 1,
    },
  },
  {
    id: 'EvbeDyZ8rCgJc9wIhF3o',
    name: 'Sample NFT 6',
    forSale: true,
    coinPrice: 123.55,
    usdPrice: 845.55,
    metadata: {
      size: 2,
    },
  },
  {
    id: 'sRBlzh463WpY5OogqS4P',
    name: 'Sample NFT 7',
    forSale: false,
    coinPrice: 123.55,
    usdPrice: 845.55,
    metadata: {
      size: 3,
    },
  },
  {
    id: 'weWgMt6HNryGbvAkOp51',
    name: 'Sample NFT 8',
    forSale: true,
    coinPrice: 123.55,
    usdPrice: 845.55,
    metadata: {
      size: 4,
    },
  },
];

@Controller()
export class NFTController {
  constructor() {}

  @Public()
  @Get('/getAllNFTs')
  findAll(@Query() query: { filter: string }) {
    const { filter } = query;

    return {
      code: 200,
      message: '',
      data: {
        nfts: SAMPLE_DATA,
      },
    };
  }
}

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

const SAMPLE_DATA = [
  {
    id: '1RVoIdac62lw3fObHTqG',
    name: 'Sample NFT 1',
    forSale: true,
    metadata: {
      size: 1,
    },
  },
  {
    id: 'EvbeDyZ8rCgJc9wIhFio',
    name: 'Sample NFT 2',
    forSale: true,
    metadata: {
      size: 2,
    },
  },
  {
    id: 'sRBlzh463WpY5OogqSvP',
    name: 'Sample NFT 3',
    forSale: false,
    metadata: {
      size: 3,
    },
  },
  {
    id: 'weWgMt6HNryGbvAkOp21',
    name: 'Sample NFT 4',
    forSale: true,
    metadata: {
      size: 4,
    },
  },
];

@Controller()
export class NFTController {
  constructor() {}

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

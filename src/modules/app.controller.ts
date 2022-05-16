import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/guard/jwt-auth.guard';
import axios from 'axios';

@Controller()
export class AppController {
  @Public()
  @Get('/image')
  async getImage(@Query('path') path: string) {
    try {
      const response = await axios.get(encodeURI(path), {
        responseType: 'arraybuffer',
      });

      return response.data;
    } catch (err) {
      throw err;
    }
  }
}

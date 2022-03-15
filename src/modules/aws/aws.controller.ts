import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/guard/jwt-auth.guard';
import { PresignURLDTO } from './DTO/presign-url-dto';
import * as AWS from 'aws-sdk';
import { nanoid } from 'nanoid';

@Controller('aws')
export class AWSController {
  @Post('/presignURL')
  @Public()
  async getPresignURL(@Body() body: PresignURLDTO) {
    const s3 = new AWS.S3();

    return new Promise((resolve, reject) => {
      s3.getSignedUrl(
        'putObject',
        {
          Bucket: 'nft-metaversus',
          Key: `chat/${nanoid() + '_' + body.fileName}`,
          Expires: 15 * 60,
        },
        (error: Error, url: string) => {
          if (error) {
            reject(error);
          }

          resolve({
            code: 200,
            message: '',
            data: url,
          });
        },
      );
    });
  }
}

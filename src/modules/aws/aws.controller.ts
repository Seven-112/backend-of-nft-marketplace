import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { Public } from 'src/guard/jwt-auth.guard';
import { PresignURLDTO } from './DTO/presign-url-dto';
import * as AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
import { CompleteUploadDTO } from './DTO/complete-upload-dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@Controller('aws')
export class AWSController {
  async getPresign(path: string) {
    const s3 = new AWS.S3();
    return new Promise((resolve, reject) => {
      s3.getSignedUrl(
        'putObject',
        {
          Bucket: process.env.AWS_BUCKET,
          Key: path,
          Expires: 15 * 60,
        },
        (error: Error, url: string) => {
          if (error) {
            reject(error);
          }

          resolve(url);
        },
      );
    });
  }

  @Post('/presignURL')
  @Public()
  @UsePipes(new ValidationPipe())
  async getPresignURL(@Body() body: PresignURLDTO) {
    const id = nanoid();
    const path = `${body.folder}/${id + '_' + body.fileName}`;
    const url = await this.getPresign(path);

    return {
      urlUpload: url,
      urlEndpoint: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${path}`,
    };
  }
}

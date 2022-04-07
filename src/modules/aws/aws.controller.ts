import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { JwtAuthGuard, Public } from 'src/guard/jwt-auth.guard';
import { PresignURLDTO } from './DTO/presign-url-dto';
import * as AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { TranslateBodyDTO } from './DTO/translate.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

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

  @Public()
  @Post('/presignURL')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async getPresignURL(@Body() body: PresignURLDTO) {
    const id = nanoid();
    const path = `${body.folder}/${id + '_' + body.fileName}`;
    const url = await this.getPresign(path);

    return {
      code: 200,
      message: '',
      data: {
        urlUpload: url,
        urlEndpoint: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${path}`,
      },
    };
  }

  @Post('/translate')
  @Public()
  @UsePipes(new ValidationPipe())
  async getTranslatedData(@Body() body: TranslateBodyDTO) {
    const translate = new AWS.Translate();

    const handleTranslate = (text: string) => {
      const params: AWS.Translate.TranslateTextRequest = {
        SourceLanguageCode: 'auto',
        TargetLanguageCode: body.targetLanguageCode,
        Text: text,
      };

      return translate
        .translateText(params, (err, data) => {
          if (err) return err;

          return data;
        })
        .promise();
    };

    if (typeof body.translateData === 'string') {
      try {
        const response = await handleTranslate(body.translateData);

        return { code: 200, data: response.TranslatedText };
      } catch (error) {
        return error;
      }
    } else if (Object.keys(body.translateData).length > 0) {
      try {
        const translatedData = {};

        for (let key in body.translateData) {
          if (Array.isArray(body.translateData[key])) {
            translatedData[key] = await Promise.all(
              body.translateData[key].map(async (item) => {
                const responseType = await handleTranslate(item.display_type);
                const responseValue = await handleTranslate(item.value);

                if (responseType.$response.error) {
                  throw responseType.$response.error;
                }

                if (responseValue.$response.error) {
                  throw responseValue.$response.error;
                }

                return {
                  trait_type: item.trait_type,
                  display_type: responseType.TranslatedText,
                  value: responseValue.TranslatedText,
                };
              }),
            );
          } else {
            const response = await handleTranslate(body.translateData[key]);

            if (response.$response.error) {
              throw response.$response.error;
            } else {
              translatedData[key] = response.TranslatedText;
            }
          }
        }

        return { code: 200, data: translatedData };
      } catch (error) {
        return error;
      }
    }
  }
}

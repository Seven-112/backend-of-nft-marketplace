import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { PORT } from './utils/constants';
import * as helmet from 'helmet';
import Amplify from 'aws-amplify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import aws from 'aws-sdk';

const awsmobile = {
  aws_project_region: 'eu-west-2',
  aws_cognito_identity_pool_id:
    'eu-west-2:4de1dd10-ef31-48de-a084-9e2285978a4e',
  aws_cognito_region: 'eu-west-2',
  aws_user_pools_id: 'eu-west-2_xi1EqOokH',
  aws_user_pools_web_client_id: '7ml60ccnhckelan838rpnmr7gk',
  oauth: {},
  aws_cognito_username_attributes: ['EMAIL'],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ['EMAIL'],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: ['SMS'],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ['EMAIL'],
};

import { NestExpressApplication } from '@nestjs/platform-express';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: console,
    cors: true,
  });

  app.setGlobalPrefix('v1');
  Amplify.configure(awsmobile);
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Metaversus API')
    .setDescription('The Metaversus API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  console.info(`server running on port ${PORT}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();

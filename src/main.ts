import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { PORT } from './utils/constants';
import * as helmet from 'helmet';

import { NestExpressApplication } from '@nestjs/platform-express';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: console,
    cors: true,
  });

  app.use(helmet());

  await app.listen(PORT);

  console.info(`server running on port ${PORT}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();

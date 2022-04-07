"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./modules/app.module");
const constants_1 = require("./utils/constants");
const aws_amplify_1 = require("aws-amplify");
const swagger_1 = require("@nestjs/swagger");
const session = require("express-session");
const awsmobile = {
    aws_project_region: 'eu-west-2',
    aws_cognito_identity_pool_id: 'eu-west-2:4de1dd10-ef31-48de-a084-9e2285978a4e',
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
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: console,
        cors: true,
    });
    app.use(session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
        },
    }));
    app.setGlobalPrefix('v1');
    aws_amplify_1.default.configure(awsmobile);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Metaversus API')
        .setDescription('The Metaversus API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(constants_1.PORT);
    console.info(`server running on port ${constants_1.PORT}`);
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
//# sourceMappingURL=main.js.map
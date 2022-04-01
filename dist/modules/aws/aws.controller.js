"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../guard/jwt-auth.guard");
const presign_url_dto_1 = require("./DTO/presign-url-dto");
const AWS = require("aws-sdk");
const nanoid_1 = require("nanoid");
const validation_pipe_1 = require("../../pipes/validation.pipe");
const translate_dto_1 = require("./DTO/translate.dto");
const swagger_1 = require("@nestjs/swagger");
let AWSController = class AWSController {
    async getPresign(path) {
        const s3 = new AWS.S3();
        return new Promise((resolve, reject) => {
            s3.getSignedUrl('putObject', {
                Bucket: process.env.AWS_BUCKET,
                Key: path,
                Expires: 15 * 60,
            }, (error, url) => {
                if (error) {
                    reject(error);
                }
                resolve(url);
            });
        });
    }
    async getPresignURL(body) {
        const id = (0, nanoid_1.nanoid)();
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
    async getTranslatedData(body) {
        const translate = new AWS.Translate();
        const handleTranslate = (text) => {
            const params = {
                SourceLanguageCode: 'auto',
                TargetLanguageCode: body.targetLanguageCode,
                Text: text,
            };
            return translate
                .translateText(params, (err, data) => {
                if (err)
                    return err;
                return data;
            })
                .promise();
        };
        if (typeof body.translateData === 'string') {
            try {
                const response = await handleTranslate(body.translateData);
                return { code: 200, data: response.TranslatedText };
            }
            catch (error) {
                return error;
            }
        }
        else if (Object.keys(body.translateData).length > 0) {
            try {
                const translatedData = {};
                for (let key in body.translateData) {
                    if (Array.isArray(body.translateData[key])) {
                        translatedData[key] = await Promise.all(body.translateData[key].map(async (item) => {
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
                        }));
                    }
                    else {
                        const response = await handleTranslate(body.translateData[key]);
                        if (response.$response.error) {
                            throw response.$response.error;
                        }
                        else {
                            translatedData[key] = response.TranslatedText;
                        }
                    }
                }
                return { code: 200, data: translatedData };
            }
            catch (error) {
                return error;
            }
        }
    }
};
__decorate([
    (0, common_1.Post)('/presignURL'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [presign_url_dto_1.PresignURLDTO]),
    __metadata("design:returntype", Promise)
], AWSController.prototype, "getPresignURL", null);
__decorate([
    (0, common_1.Post)('/translate'),
    (0, jwt_auth_guard_1.Public)(),
    (0, common_1.UsePipes)(new validation_pipe_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [translate_dto_1.TranslateBodyDTO]),
    __metadata("design:returntype", Promise)
], AWSController.prototype, "getTranslatedData", null);
AWSController = __decorate([
    (0, common_1.Controller)('aws')
], AWSController);
exports.AWSController = AWSController;
//# sourceMappingURL=aws.controller.js.map
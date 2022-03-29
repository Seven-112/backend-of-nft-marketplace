import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';

const aws_cognito_region = 'eu-west-2';
const aws_user_pools_id = 'eu-west-2_xi1EqOokH';
const aws_user_pools_web_client_id = '7ml60ccnhckelan838rpnmr7gk';
const issuer = `https://cognito-idp.${aws_cognito_region}.amazonaws.com/${aws_user_pools_id}`;
const jwksUri = `${issuer}/.well-known/jwks.json`;

@Injectable()
export class JwtSocketStrategy extends PassportStrategy(Strategy, 'socketJwt') {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri,
      }),
      jwtFromRequest: (header: any) =>
        header.handshake.headers.authorization.split(' ')[1],
      aud: aws_user_pools_web_client_id,
      issuer,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: unknown) {
    return payload;
  }
}

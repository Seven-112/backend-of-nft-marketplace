import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { SocketGateway } from './socket.gateway';
import { JwtSocketStrategy } from './socket.strategy';

@Module({
  imports: [UserModule],
  providers: [SocketGateway, JwtSocketStrategy],
})
export class SocketModule {}

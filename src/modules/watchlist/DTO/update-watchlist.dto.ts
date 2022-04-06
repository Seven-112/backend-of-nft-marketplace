import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { ValidAddress } from 'src/decorators/valid-address.decorator';

export class UpdateWatchlistDTO {
  @IsString()
  @ApiProperty()
  @ValidAddress()
  address: string;
}

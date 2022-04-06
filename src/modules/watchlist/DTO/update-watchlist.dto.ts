import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { ValidAddress } from 'src/decorators/valid-address.decorator';

export class AddWatchlistDTO {
  @IsString()
  @ApiProperty()
  @ValidAddress()
  address: string;
}

export class RemoveWatchlistDTO {
  @IsString({ each: true })
  @ApiProperty()
  @ValidAddress()
  addresses: string[];
}

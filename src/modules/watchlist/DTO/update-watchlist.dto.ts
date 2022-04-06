import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { ValidAddress } from 'src/decorators/valid-address.decorator';

export class UpdateWatchlistDTO {
  @IsString({ each: true })
  @ApiProperty()
  @ValidAddress({ each: true })
  list: string[];
}

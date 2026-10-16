import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

// POST and PUT accept the same complete product fields.
export class ProductRequest {
  @ApiProperty({ example: 'Bàn phím cơ', maxLength: 255 })
  @IsString()
  @Matches(/\S/, { message: 'name must not be blank' })
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: 'Bàn phím kết nối USB', nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ example: 750000, minimum: 0, maximum: 99999999.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99)
  price: number;

  @ApiProperty({ example: 20, minimum: 0, maximum: 2147483647 })
  @IsInt()
  @Min(0)
  @Max(2147483647)
  quantity: number;
}

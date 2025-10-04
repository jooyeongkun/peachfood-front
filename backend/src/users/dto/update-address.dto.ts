import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}

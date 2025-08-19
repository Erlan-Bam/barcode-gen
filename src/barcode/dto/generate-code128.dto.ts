import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GenerateCode128Dto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(25)
  value!: string;

  @IsOptional()
  userId!: string;

  token!: string;
}

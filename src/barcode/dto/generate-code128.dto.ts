import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ValuesDto } from './values.dto';

export class GenerateCode128Dto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(25)
  value!: string;

  @IsOptional()
  userId!: string;
}

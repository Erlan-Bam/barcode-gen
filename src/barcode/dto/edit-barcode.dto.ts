import { PartialType } from '@nestjs/mapped-types';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GeneratePDF417Dto } from './generate-pdf417.dto';
import { BarcodeType } from '@prisma/client';

@ApiExtraModels(GeneratePDF417Dto)
export class EditBarcodeDto extends GeneratePDF417Dto {
  @ApiProperty({
    description: 'Barcode type',
    enum: BarcodeType,
    enumName: 'BarcodeType', // helps Swagger show a named enum
    example: 'PDF417',
  })
  @IsEnum(BarcodeType)
  type!: BarcodeType;
}

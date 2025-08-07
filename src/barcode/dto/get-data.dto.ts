import {
  IsOptional,
  IsString,
  Length,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType } from 'src/barcode-config/dto/configs.dto';

export class GetDataDto {
  @ApiPropertyOptional({
    description: 'Country code (string). Defaults to "USA" inside the service.',
    type: String,
    default: 'USA',
  })
  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  country?: string;

  @ApiPropertyOptional({
    description: 'DAJ (state) — exactly 2 characters.',
    type: String,
    minLength: 2,
    maxLength: 2,
    default: undefined,
    example: 'CA',
  })
  @IsOptional()
  @Length(2, 2, { message: 'State must be exactly 2 characters' })
  DAJ?: string;

  @ApiPropertyOptional({
    description: 'DDB (revision) — any string.',
    type: String,
    default: undefined,
    example: '08292017',
  })
  @IsOptional()
  @IsString({ message: 'Revision must be a string' })
  DDB?: string;

  @ApiPropertyOptional({
    description: 'Document type: either "DL" or "ID".',
    enum: DocumentType,
    default: DocumentType.DL,
  })
  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

  @ApiPropertyOptional({
    description: 'Flag — boolean.',
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Flag must be a boolean or "true"/"false"' })
  flag?: boolean;
}

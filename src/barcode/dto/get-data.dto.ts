// src/barcode/dto/get-data.dto.ts
import {
  IsOptional,
  IsString,
  Length,
  IsIn,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { DocumentType } from 'src/barcode-config/dto/configs.dto';

export class GetDataDto {
  /**
   * country — строка, необязательно.
   * (по умолчанию “USA” внутри сервиса)
   */
  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  country?: string;

  /**
   * DAJ (state) — ровно 2 символа, необязательно.
   */
  @IsOptional()
  @Length(2, 2, { message: 'State must be exactly 2 characters' })
  DAJ?: string;

  /**
   * DDB (revision) — любая строка, необязательно.
   */
  @IsOptional()
  @IsString({ message: 'Revision must be a string' })
  DDB?: string;

  /**
   * type — “DL” или “ID”, необязательно.
   */
  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

  /**
   * flag — булево, необязательно.
   */
  @IsOptional()
  @IsBoolean({ message: 'Flag must be a boolean or "true"/"false"' })
  flag?: boolean;
}

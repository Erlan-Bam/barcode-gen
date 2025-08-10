import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class ValuesDto {
  @ApiPropertyOptional({ description: 'State (2-letter uppercase)' })
  @IsString()
  @IsOptional()
  @MaxLength(2)
  @Matches(/^[A-Z]{2}$/)
  DAJ!: string;

  @ApiPropertyOptional({ description: 'Revision (MMDDYYYY, 8 digits)' })
  @IsString()
  @IsOptional()
  @Matches(/^\d{8}$/)
  DDB!: string;

  // Names
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  @Matches(/^[A-Za-z .,'-]*$/)
  DAC?: string; // First Name

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  @Matches(/^[A-Za-z .,'-]*$/)
  DAD?: string; // Middle Name

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  @Matches(/^[A-Za-z .,'-]*$/)
  DCS?: string; // Last Name

  // Address
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(35)
  @Matches(/^[A-Za-z0-9 .,'#/-]*$/)
  DAG?: string; // Street

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Matches(/^[A-Za-z .,'-]*$/)
  DAI?: string; // City

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(11)
  @Matches(/^\d{5}(?:-\d{4})?$/)
  DAK?: string; // ZIP (5 or 9)

  // Doc / IDs
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(256)
  @Matches(/^[A-Za-z0-9 ]*$/)
  DAQ?: string; // DL Number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(256)
  @Matches(/^[A-Za-z0-9 ]*$/)
  DCF?: string; // DD

  // Dates (8 digits)
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/)
  DBA?: string; // Exp
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/)
  DBB?: string; // DOB
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/)
  DBD?: string; // Iss

  // Codes / enums (tune as needed)
  @ApiPropertyOptional() @IsOptional() @IsInt() DBC?: number; // Sex
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(12)
  @Matches(/^[A-Z]*$/)
  DAZ?: string; // Hair
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(3)
  @Matches(/^[A-Z]*$/)
  DAY?: string; // Eyes

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(6)
  DCA?: string; // Class
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(12)
  DCB?: string; // Restrictions
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5)
  DCD?: string; // Endorsement

  // Heights/weights numeric strings used by your generator
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d{1,3}$/)
  DAU?: string; // Height (cm as "NNN")
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d{1,3}$/)
  DAW?: string; // Weight (lbs as "NNN")

  // Misc
  @ApiPropertyOptional() @IsOptional() @IsInt() DDK?: number; // Veteran
  @ApiPropertyOptional() @IsOptional() @IsInt() DDL?: number; // Donor
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(25)
  DCK?: string; // Inv Number
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  DCL?: string; // Race code
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  DDA?: string; // Compliance type
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(3)
  QQQ?: string; // Doc type
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  ZGD?: string; // District
}

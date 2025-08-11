import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { ValuesDto } from './values.dto';

@ApiExtraModels(ValuesDto)
export class GeneratePDF417Dto {
  @ApiProperty({
    description: 'Allowed keys only (DAC, DAD, ... ZGD). Extra keys cause 400.',
    oneOf: [{ $ref: getSchemaPath(ValuesDto) }],
  })
  @IsObject()
  @ValidateNested()
  @Type(() => ValuesDto)
  values!: ValuesDto;

  userId!: string;
}

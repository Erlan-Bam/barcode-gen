// src/barcode/dto/get-calculate.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  IsString,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const CALC_OUTPUT_SETS: string[][] = [
  ['DBA'], // expiration date
  ['DCK'], // inventory number
  ['DCF'], // DD number
];

@ValidatorConstraint({ name: 'CalcOutputSet', async: false })
class CalcOutputSetConstraint implements ValidatorConstraintInterface {
  validate(values: string[]) {
    if (!Array.isArray(values) || values.some((v) => typeof v !== 'string'))
      return false;
    const joined = values.join(',');
    return CALC_OUTPUT_SETS.some((set) => set.join(',') === joined);
  }
  defaultMessage() {
    return `output must be one of: ${CALC_OUTPUT_SETS.map((s) => `[${s.join(', ')}]`).join(' | ')}`;
  }
}

export class GetCalculateDto {
  @ApiProperty({
    description: 'Входные параметры (аббревиатуры и их значения)',
    type: 'object',
    additionalProperties: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    example: { DAJ: 'NY', DBC: 1 },
  })
  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  input!: Record<string, string | number>;

  @ApiProperty({
    required: true,
    description: 'Какую величину рассчитать (строгий набор)',
    oneOf: [
      {
        type: 'array',
        items: { type: 'string', enum: ['DBA'] },
        minItems: 1,
        maxItems: 1,
        example: ['DBA'],
      },
      {
        type: 'array',
        items: { type: 'string', enum: ['DCK'] },
        minItems: 1,
        maxItems: 1,
        example: ['DCK'],
      },
      {
        type: 'array',
        items: { type: 'string', enum: ['DCF'] },
        minItems: 1,
        maxItems: 1,
        example: ['DCF'],
      },
    ],
  })
  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  @Validate(CalcOutputSetConstraint)
  output!: string[];
}

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

const SUPPORTED_OUTPUT_SETS: string[][] = [
  ['DAG', 'DAI', 'DAK'],
  ['DAC', 'DAD', 'DCS'],
  ['DBB'],
  ['DAQ'],
  ['DBD', 'DBA'],
  ['DCJ'],
];

@ValidatorConstraint({ name: 'OutputSet', async: false })
class OutputSetConstraint implements ValidatorConstraintInterface {
  validate(values: string[]) {
    if (!Array.isArray(values) || values.some((v) => typeof v !== 'string'))
      return false;
    const joined = values.join(',');
    return SUPPORTED_OUTPUT_SETS.some((set) => set.join(',') === joined);
  }
  defaultMessage() {
    return `Output must be one of: ${SUPPORTED_OUTPUT_SETS.map(
      (s) => `[${s.join(', ')}]`,
    ).join(' | ')}`;
  }
}

export class GetRandomDto {
  @ApiProperty({
    description:
      'Ключи — аббревиатуры полей (DAJ, DBC и т.д.), значения — string/number',
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
    description: 'Строго допустимые наборы; порядок важен',
    oneOf: [
      {
        type: 'array',
        items: { type: 'string', enum: ['DBB'] },
        minItems: 1,
        maxItems: 1,
        example: ['DBB'],
      },
      {
        type: 'array',
        items: { type: 'string', enum: ['DAQ'] },
        minItems: 1,
        maxItems: 1,
        example: ['DAQ'],
      },
      {
        type: 'array',
        items: { type: 'string', enum: ['DBD', 'DBA'] },
        minItems: 2,
        maxItems: 2,
        example: ['DBD', 'DBA'],
      },
      {
        type: 'array',
        items: { type: 'string', enum: ['DAC', 'DAD', 'DCS'] },
        minItems: 3,
        maxItems: 3,
        example: ['DAC', 'DAD', 'DCS'],
      },
      {
        type: 'array',
        items: { type: 'string', enum: ['DAG', 'DAI', 'DAK'] },
        minItems: 3,
        maxItems: 3,
        example: ['DAG', 'DAI', 'DAK'],
      },
      {
        type: 'array',
        items: { type: 'string', enum: ['DCJ'] },
        minItems: 1,
        maxItems: 1,
        example: ['DCJ'],
      },
    ],
  })
  @IsArray()
  @IsString({ each: true })
  @Validate(OutputSetConstraint)
  @IsDefined({ message: 'output is required' })
  output!: string[];
}

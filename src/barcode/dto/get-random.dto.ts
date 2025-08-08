import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
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
  @IsObject()
  @IsNotEmptyObject()
  input!: Record<string, string | number>;

  @ApiProperty({
    description:
      'Какой набор данных сгенерировать (строгие наборы, порядок важен — совпадает с реализацией)',
    type: [String],
    examples: [
      ['DBB'],
      ['DAQ'],
      ['DBD', 'DBA'],
      ['DAC', 'DAD', 'DCS'],
      ['DAG', 'DAI', 'DAK'],
      ['DCJ'],
    ],
  })
  @IsArray()
  @IsString({ each: true })
  @Validate(OutputSetConstraint)
  output!: string[];
}

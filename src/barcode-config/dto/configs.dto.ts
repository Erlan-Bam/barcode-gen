import {
  RadioField,
  SelectField,
  InputField,
  CalendarField,
  ChoiserField,
  IconField,
} from 'src/shared/dto/fields.dto';
export type BarcodeGenerateConfig = {
  columns: number;
  errorLevel: number;
  minRows?: number;
  paddingWord?: number;
  compactionType: string;
  encoding?: string;
  code13?: boolean;
  code13_2?: boolean;
  code27?: boolean;
  code39?: boolean;
  code42?: boolean;
  code44?: boolean;
  code45?: boolean;
  code46?: boolean;
  code46_2?: boolean;
  code97?: boolean;
  last_r?: boolean;
  last_r2?: boolean;
  last_r3?: boolean;
  small_in?: boolean;
  sn16?: boolean;
  no10code?: boolean;
  withSignature?: boolean;
};
export type BarcodePageTopFieldsArgs = {
  state: Record<string, string>;
  rev: Record<string, string>;
  district?: SelectField;
  DAH?: boolean;
};
export type BarcodePageTopFields = [
  [RadioField],
  [SelectField, SelectField],
  [
    [InputField, InputField, InputField],
    [SelectField, CalendarField],
    (SelectField | InputField)[],
  ],
  [ChoiserField],
];

export type DLDownFields = [
  ChoiserField[],
  (InputField | SelectField | IconField | CalendarField)[],
  InputField[],
  (InputField | SelectField)[],
  SelectField[],
];

export type IDDownFields = [
  ChoiserField[],
  (InputField | SelectField | IconField | CalendarField)[],
  InputField[],
  (InputField | SelectField)[],
  SelectField[],
];
export type BarcodeConfigsFields = {
  top: BarcodePageTopFields;
  down: {
    DL: DLDownFields;
    ID?: IDDownFields;
  };
};
export type BarcodeConfigFields = {
  top: BarcodePageTopFields;
  down: DLDownFields | IDDownFields | undefined;
};
export type BarcodeConfigs = {
  state: string;
  rev: string;
  country: string;
  fields: BarcodeConfigsFields;
  generate(data: Record<string, string>): [string, BarcodeGenerateConfig];
};

export type BarcodeConfig = {
  state: string;
  rev: string;
  type: string;
  fields: BarcodeConfigFields;
  validation: (data: Record<string, string>) => Promise<Record<string, string>>;
  generate(data: Record<string, string>): [string, BarcodeGenerateConfig];
};
export type DLConfigFieldsToPresent = [
  [RadioField],
  [SelectField, SelectField],
  [
    [InputField, InputField, InputField],
    [CalendarField],
    (SelectField | InputField)[],
  ],
  ChoiserField[],
  (InputField | SelectField | IconField | CalendarField)[],
  InputField[],
  (InputField | SelectField)[],
  SelectField[],
];
export enum DocumentType {
  'DL' = 'DL',
  'ID' = 'ID',
}

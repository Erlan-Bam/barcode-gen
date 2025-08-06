import {
  InputField,
  InputFieldArgs,
  RadioField,
  RadioFieldArgs,
  SelectField,
  SelectFieldArgs,
  IconField,
  IconFieldArgs,
  CalendarField,
  CalendarFieldArgs,
  ChoiserField,
  ChoiserFieldArgs,
} from '../dto/fields.dto';

export function input({
  t = '',
  a = '',
  p = '',
  r = false,
  rh = {},
  c = false,
  ch = {},
  v = '',
}: InputFieldArgs): InputField {
  const result: InputField = { title: t, abr: a, type: 'input', value: v };

  if (p) result.pattern = p;
  if (r) {
    result.random = r;
    result.randomHandler = rh;
  }
  if (c) {
    result.calculate = c;
    result.calculateHandler = ch;
  }
  return result;
}
export function radio({
  t = '',
  a = '',
  values = {},
}: RadioFieldArgs): RadioField {
  const result: RadioField = {
    title: t,
    abr: a,
    type: 'radio',
  };

  if (Object.keys(values).length) result.values = { ...values };
  return result;
}
export function select({
  t = '',
  a = '',
  values = {},
  oCS = [],
}: SelectFieldArgs): SelectField {
  const result: SelectField = {
    title: t,
    abr: a,
    onChangeSend: oCS,
    type: 'select',
    selected: '',
  };
  if (Object.keys(values).length) result.values = { ...values };
  return result;
}
export function icon({
  t = '',
  abr = '',
  v = 0,
  i = '',
}: IconFieldArgs): IconField {
  const result: IconField = {
    title: t,
    abr,
    value: v,
    type: 'icon',
    icon: i,
  };
  return result;
}
export function calendar({
  t = '',
  a = '',
  alt = '',
  r = false,
  rh = {},
  c = false,
  ch = {},
  v = '',
}: CalendarFieldArgs): CalendarField {
  const result: CalendarField = {
    title: t,
    abr: a,
    type: 'calendar',
    alt: alt,
    value: v,
  };

  if (r) {
    result.random = r;
    result.randomHandler = rh;
  }
  if (c) {
    result.calculate = c;
    result.calculateHandler = ch;
  }
  return result;
}
export function choiser({
  t = '',
  a = '',
  alt = '',
  v = {},
  oCS = [],
}: ChoiserFieldArgs): ChoiserField {
  const result: ChoiserField = {
    title: t,
    abr: a,
    type: 'choiser',
    alt: alt,
    values: v,
  };
  if (oCS.length) result.onChangeSend = oCS;
  return result;
}

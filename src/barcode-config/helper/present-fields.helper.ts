import { fN } from 'src/shared/const/fields-names.const';
import { DataToPresentCache } from '../barcode-config.service';
import {
  BarcodeConfigFields,
  BarcodeConfigs,
  BarcodeConfigsFields,
  DLConfigFieldsToPresent,
  DLDownFields,
} from '../dto/configs.dto';

type PresenterValues = [
  country?: string,
  state?: string,
  rev?: string,
  type?: 'DL' | 'ID',
  flag?: boolean,
];

export class PresentFields {
  readonly #stateName: string = fN.DAJ;
  readonly #revName: string = fN.DDB;
  protected readonly DAJ: string | undefined;
  protected readonly DDB: string | undefined;
  protected readonly type: 'DL' | 'ID';
  protected readonly flag: boolean;
  protected readonly cache: DataToPresentCache = { states: {}, revisions: {} };
  protected readonly country: string;
  protected readonly configs: BarcodeConfigs[] = [];

  constructor(values: PresenterValues = [], configs: BarcodeConfigs[] = []) {
    let [
      country = 'USA',
      state = undefined,
      rev = undefined,
      type = 'DL',
      flag = false,
    ] = values;
    this.country = country;
    this.DAJ = state;
    this.DDB = rev;
    this.type = type == 'DL' || type == 'ID' ? type : 'DL';
    this.flag = !!flag;
    this.configs = configs;
  }
  protected mapStateFn = ({
    fields,
  }: BarcodeConfigs): Record<string, string> => {
    for (let i = 0; i < fields.top.length; i++) {
      const row = fields.top[i];
      for (const el of row) {
        if (!Array.isArray(el) && el.title === this.#stateName) {
          return el.values as Record<string, string>;
        }
      }
    }
    return {};
  };
  protected sortStateFn = (
    a: Record<string, string> | undefined,
    b: Record<string, string> | undefined,
  ): number => {
    for (let i = 0; i < 1; i++) {
      return a && b && Object.keys(a)[i] > Object.keys(b)[i] ? 1 : -1;
    }
    return -1;
  };
  protected reduceStateFn = (
    acc: Record<string, string>,
    el: Record<string, string> | undefined,
  ): Record<string, string> => {
    if (el) {
      for (let key of Object.keys(el)) {
        if (!Object.keys(acc).includes(key)) {
          acc[key] = el[key];
        }
      }
    }
    return acc;
  };
  protected mapRevisionsFn = (
    state: BarcodeConfigs,
  ): Record<string, string> => {
    for (let i = 0; i < state.fields.top.length; i++) {
      const row = state.fields.top[i];
      if (state.state == this.currState)
        for (const el of row) {
          if (!Array.isArray(el) && el.title == this.#revName) {
            return el.values as Record<string, string>;
          }
        }
    }
    return {} as Record<string, string>;
  };
  protected sortRevisionsFn = (
    a: Record<string, string> | undefined,
    b: Record<string, string> | undefined,
  ): number => {
    for (let i = 0; i < 1; i++) {
      return a && b && Object.keys(a)[i] < Object.keys(b)[i] ? 1 : -1;
    }
    return -1;
  };
  protected reduceRevisionsFn = (
    acc: Record<string, string>,
    el: Record<string, string> | undefined,
  ): Record<string, string> => {
    if (el) {
      for (let k of Object.keys(el)) {
        acc[k] = el[k];
      }
    }
    return acc;
  };
  protected get getStates(): Record<string, string> {
    if (Object.keys(this.cache.states).length) {
      return this.cache.states;
    }
    let states: Array<Record<string, string>> = this.configs
      .filter((e) => e.country == this.country)
      .map(this.mapStateFn);
    let sortedStates: Array<Record<string, string> | undefined> = states.sort(
      this.sortStateFn,
    );
    this.cache.states = sortedStates.reduce(this.reduceStateFn, {});
    return this.cache.states;
  }
  protected get currState(): string | undefined {
    if (this.DAJ) return this.DAJ;
    for (let key of Object.keys(this.getStates)) {
      return this.getStates[key];
    }
  }
  protected get revisions(): Record<string, string> {
    if (Object.keys(this.cache.revisions).length) {
      return this.cache.revisions;
    }
    let revisions: Array<Record<string, string> | undefined> = this.configs.map(
      this.mapRevisionsFn,
    );
    let sortedRevisions: Array<Record<string, string> | undefined> =
      revisions.sort(this.sortRevisionsFn);
    this.cache.revisions = sortedRevisions.reduce(this.reduceRevisionsFn, {});
    return this.cache.revisions;
  }
  protected get currRevision(): string | undefined {
    if (this.DDB) return this.DDB;
    for (let key of Object.keys(this.revisions)) {
      return this.revisions[key];
    }
  }
  protected selectState = (el: any, country: string): void => {
    if (!Array.isArray(el) && el.title == this.#stateName) {
      el.values = { ...this.getStates };
      for (const key of Object.keys(this.getStates)) {
        if (this.currState === this.getStates[key]) {
          if ('selected' in el) {
            el.selected = key;
            break;
          }
        }
      }
    }
  };
  protected selectRevision = (el: any): void => {
    if (!Array.isArray(el) && el.title == this.#revName) {
      el.values = { ...this.revisions };
      for (const [key2, value] of Object.entries(this.revisions)) {
        if (value === this.currRevision) {
          if ('selected' in el) {
            el.selected = key2;
            break;
          }
        }
      }
    }
  };
  fields(): DLConfigFieldsToPresent | DLDownFields {
    let selectCountry: BarcodeConfigs[] = this.configs.filter(
      (e) => e.country == this.country,
    );
    let resultFields: BarcodeConfigsFields =
      selectCountry.find(
        (config) =>
          config.state === this.currState && config.rev === this.currRevision,
      )?.fields || selectCountry[0].fields;

    let resultObject: BarcodeConfigFields = {
      top: resultFields.top,
      down: resultFields.down?.ID
        ? resultFields.down[this.type]
        : resultFields.down.DL,
    };
    if (this.flag && resultObject.down) return resultFields.down[this.type]!;

    for (let i = 0; i < resultObject.top.length; i++) {
      const row = resultFields.top[i];
      for (const el of row) {
        this.selectState(el, this.country);
        this.selectRevision(el);
      }
    }
    return [
      ...resultObject.top,
      resultFields.down[this.type],
    ] as unknown as DLConfigFieldsToPresent;
  }
  getData() {
    return this.fields();
  }
}

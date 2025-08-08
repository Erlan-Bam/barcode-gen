import { Injectable } from '@nestjs/common';
import {
  BarcodeConfigFields,
  BarcodeConfigs,
  BarcodeConfigsFields,
  BarcodeGenerateConfig,
  DLConfigFieldsToPresent,
  DLDownFields,
  DocumentType,
} from './dto/configs.dto';
import {
  CamelCase,
  downChoisers,
  georgiaDistrictSelectField,
  lbsToDCEConvert,
  stringToHex,
  topFields,
  under18,
  under19,
  under21,
} from './helper/config.helper';
import { calendar, icon, input, select } from 'src/shared/helper/fields.helper';
import { fN } from 'src/shared/const/fields-names.const';
import {
  eyes,
  hairs,
  hairsFull,
  race,
  stateEyes,
  stateHair,
} from '../shared/const/characteristics.const';
import { getRandNum } from 'src/shared/helper/functions.helper';
import { GetDataDto } from 'src/barcode/dto/get-data.dto';
import { PresentFields } from './helper/present-fields.helper';
export type DataToPresentCache = {
  states: Record<string, string>;
  revisions: Record<string, string>;
};
@Injectable()
export class BarcodeConfigService {
  readonly configs: BarcodeConfigs[] = [
    {
      // TODO  under 21
      state: 'CA',
      rev: '08292017',
      country: 'USA',
      fields: {
        top: topFields({
          state: { California: 'CA' },
          rev: { 'Rev. 2017.08.29 (0901)': '08292017' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - Any vehicle or combination of vehicles except motorcycles':
                    'A',
                  'Class C -Veh w/GVWR ≤ 26000, No M/C': 'C',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA': ['DCF'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  '01 - Must wear corrective lenses when driving': '01',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
          ID: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA': ['DCF'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        let federalFields =
          docType == DocumentType.DL
            ? `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA${data.DCU ? '\nDCU' + data.DCU : ''}\nDAW${data.DAW.padStart(3, '0')}\nDAZ${data.DAZ}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`
            : `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA${data.DCU ? '\nDCU' + data.DCU : ''}\nDAW${data.DAW.padStart(3, '0')}\nDAZ${data.DAZ}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;

        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZCZCA${stateEyes[data.DAY]}\nZCB${stateHair[data.DAZ]}\nZCC\nZCD\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636014090102${docType}0041${fedLengt.padStart(4, '0')}ZC${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: 'simple',
        };

        return [str, config];
      },
    },

    {
      // TODO under 21
      state: 'UT',
      rev: '06012021',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Utah: 'UT' },
          rev: { 'Rev. 2021.06.01 (1000)': '06012021' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '^(04|05)[0-9]{5}',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: { 'D - ALL VEHICLES NOT REQURING A CDL': 'D' },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB,DDB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD,DDB': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DDB,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DDB': ['DCF'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  'A - No Restrictions': 'A',
                  'B - Corrective Lenses': 'B',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE', Z: 'Z' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'

        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDAZ${data.DAZ}\nDAW${data.DAW}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;

        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZUZUA\nZUBN\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;

        const str = `@\x0A\x1e\x0dANSI 636040100002${docType}0041${fedLengt.padStart(4, '0')}ZU${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;
        const config: BarcodeGenerateConfig = {
          columns: 11,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
        };
        return [str, config];
      },
    },
    {
      // DONE
      state: 'UT',
      rev: '04152016',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Utah: 'UT' },
          rev: { 'Rev. 2016.04.15 (0800)': '04152016' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '^(04|05)[0-9]{5}',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: { 'D - ALL VEHICLES NOT REQURING A CDL': 'D', C: 'C' },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB,DDB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD,DDB': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DDB,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DDB': ['DCF'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  'A - No Restrictions': 'A',
                  'B - Corrective Lenses': 'B',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'

        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDAW${data.DAW}\nDAZ${data.DAZ}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under19(data.DBB, data.DBD) ? '\nDDI' + under19(data.DBB, data.DBD) : ''}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;

        const stateFields = `ZUZUA\nZUBT\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\x0A\x1e\x0dANSI 636040080002${docType}0041${fedLengt.padStart(4, '0')}ZU${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;
        const config = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
        };
        return [str, config];
      },
    },
    {
      // DONE
      state: 'MI',
      rev: 'Rev 01-21-2011',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Michigan: 'MI' },
          rev: { 'Rev. 2011.01.21 (0300)': 'Rev 01-21-2011' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DAC,DAD,DCS,DBB': ['DAQ'] },
              }),
              select({ t: fN.DCA, a: 'DCA', values: { E: 'E', 'E,O': 'E,O' } }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DAQ,DBB,DBA': ['DCK'] },
              }),
              // input({ t: fN.DAU, a: 'DAU' }),
            ],
            [
              // input({ t: fN.DCF, a: 'DCF', c: true, ch: { 'DAJ': ['DCF'] } }),
              // select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              //TODO no need to barcode
              select({ t: fN.DCB, a: 'DCB', values: { NONE: 'NONE' } }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = 'DL';

        const federalFields = `${docType}DCA\nDCB\nDCD\nDBA${data.DBA}\nDCS${data.DCS}\nDCT${data.DAC}${data.DAD ? ' ' + data.DAD : ''}\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY\nDAU\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(9, '0')}  \nDAQ${data.DAQ}\nDCF\nDCG\nDCH\nDAH\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZMZMA${data.DDB}\nZMB01\n\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;

        const str = `@\x0A\x1e\x0dANSI 636032030102${docType}0041${fedLengt.padStart(4, '0')}ZM${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;
        const config = {
          columns: 12,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
        };
        return [str, config];
      },
    },
    {
      // DONE
      state: 'IL',
      rev: '09172015',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Illinois: 'IL' },
          rev: { 'Rev. 2015.09.17 (1000)': '09172015' },
          district: undefined,
          DAH: true,
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DAC,DAD,DCS,DBB,DBC': ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - Single & Combined Vehicles Except M/C': 'A',
                  'D - Regular Operators License': 'D',
                  'S - Single Vehicle GVWR < 26000 Except M/': 'S',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD': ['DCF'] },
              }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  '01 - Must wear corrective lenses when driving': '01',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'

        const federalFields = `${docType}DAQ${data.DAQ.replaceAll('-', '')}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDAW${data.DAW}${data.DAH ? '\nDAH' + data.DAH : ''}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under18(data.DBB, data.DBD) ? '\nDDH' + under18(data.DBB, data.DBD) : ''}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;

        const stateFields = `ZIZIAORG\nZIB\nZIC\nZID\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;

        const str = `@\x0A\x1e\x0dANSI 636035080002${docType}0041${fedLengt.padStart(4, '0')}ZI${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;
        const config = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
        };
        return [str, config];
      },
    },
    {
      // TODO  under 21
      state: 'NV',
      rev: '05242021',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Nevada: 'NV' },
          rev: { 'Rev. 2021.05.24 (1000)': '05242021' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'C-CARS/VANS/PICKUPS; MAY TOW A VEH < 10,000 LBS': 'C',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({ t: fN.DCK, a: 'DCK', c: true, ch: { DAJ: ['DCK'] } }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DDB': ['DCF'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({ t: fN.DCB, a: 'DCB', values: { NONE: 'NONE', B: 'B' } }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = 'DL'; // data.QQQ //'DL' //TODO

        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDAW${data.DAW}\nDAZ${data.DAZ}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        // TODO ZNC main to DCK
        const stateFields = `ZNZNA${docType}\nZNBNCDL\nZNC${data.DCK.slice(0, 11)}\nZNDSystem\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\x0A\x1e\x0dANSI 636049100002${docType}0041${fedLengt.padStart(4, '0')}ZN${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;
        const config = {
          columns: 11,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
        };
        return [str, config];
      },
    },
    {
      // TODO under 18?!
      state: 'GA',
      rev: '07012015',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Georgia: 'GA' },
          rev: { 'Rev. 2015.07.01 (0601)': '07012015' },
          district: georgiaDistrictSelectField,
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DDB': ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - &gt;26,001 lbs. GCWR &amp; Trailer &gt;10,001 lbs. All lesser vehicles, except motorcycle, with roper endorsements':
                    'A',
                  'CM - &lt; 26,000 lbs. GVWR and Trailer &lt; 10,000 lbs. All recreational vehicles and 2 or 3 wheeled motorcycles':
                    'C',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({ t: fN.DCK, a: 'DCK', c: true, ch: { DAJ: ['DCK'] } }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DCK': ['DCF'] },
              }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'A - None': 'A',
                  'B - Corrective Lenses requied': 'B',
                  'K - Intrastate commerce only, M - No class A passenger buses':
                    'K',
                  'M - No class A passenger buses': 'M',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'

        const federalFields = `${docType}DCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBA${data.DBA}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAU${data.DAU.padStart(3, '0')} in\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(9, '0')}  \nDAQ${data.DAQ}\nDCF${data.DCF}\nDCGUSA\nDAW${data.DAW.padStart(3, '0')}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under21(data.DBB, data.DBD) ? '\nDDJ01012009' : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        //TODO ZGF main number to DCK and DCF
        // TODO ZGH Violation Code
        const stateFields = `ZGZGAN\nZGBN\nZGC${Math.floor(+data.DAU / 12)}-${String(+data.DAU - Math.floor(+data.DAU / 12) * 12).padStart(2, '0')}\nZGD${data.ZGD}\nZGEN\nZGF${data.DCK.slice(0, 11)}\nZGG\nZGH${data.ZGH ? data.ZGH : '001'}\nZGI\nZGJ\nZGK\nZGL\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636055060102${docType}0041${fedLengt.padStart(4, '0')}ZG${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
        };

        return [str, config];
      },
    },
    {
      // DONE
      state: 'NC',
      rev: '10242014',
      country: 'USA',
      fields: {
        top: topFields({
          state: { 'North Carolina': 'NC' },
          rev: { 'Rev. 2014.10.24 (0800)': '10242014' },
          district: undefined,
          DAH: true,
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DDB': ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'C - Any noncommercial single vehicle with a GVWR of less than 26,001 lbs.':
                    'C',
                  'B - Any single vehicle with a GVWR of 26,001 lbs or more and any such vehicle towing':
                    'B',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({ t: fN.DCK, a: 'DCK', c: true, ch: { DAJ: ['DCK'] } }),
              input({ t: fN.DAU, a: 'DAU' }),
              // input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DCK': ['DCF'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({ t: fN.DCL, a: 'DCL', values: race }),
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', '1 - Corr Lenses': '1' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJNC\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDAZ${data.DAZ}\nDCL${data.DCL.padEnd(3, ' ')}${data.DAH ? '\nDAH' + data.DAH : ''}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under18(data.DBB, data.DBD) ? '\nDDH' + under18(data.DBB, data.DBD) : ''}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZNZNA\nZNB\nZNC0\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636004080002${docType}0041${fedLengt.padStart(4, '0')}ZN${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 3,
          compactionType: 'text',
          encoding: 'simple',
        };

        return [str, config];
      },
    },
    {
      // TODO under 18?!
      state: 'MA',
      rev: '02222016',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Massachusetts: 'MA' },
          rev: { 'Rev. 2016.02.22 (0800)': '02222016' },
          district: undefined,
          DAH: true,
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DDB': ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'D - Small vehicle less than 26,001 lbs, except school bus.':
                    'D',
                  'M - Motorcycle': 'M',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DAQ,DBD': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              // input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', 'B - Corrective Lenses': 'B' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBA${data.DBA}\nDCS${data.DCS}\nDAC${data.DAC}\nDAD${data.DAD ? data.DAD : 'NONE'}\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAU${data.DAU.padStart(3, '0')} in\nDAG${data.DAG}\nDAH${data.DAH ? data.DAH : 'NONE'}\nDAI${data.DAI}\nDAJMA\nDAK${data.DAK.padEnd(9, '0')}  \nDAQ${data.DAQ}\nDCF${data.DCF.replaceAll('/', '').toUpperCase()}\nDCGUSA\nDDEN\nDDFN\nDDGN\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZMZMA${data.ZMA ? data.ZMA : '603'}\nZMB${data.DBD}\nZMC\nZMD\nZME\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636002080002${docType}0041${fedLengt.padStart(4, '0')}ZM${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
        };

        return [str, config];
      },
    },
    {
      // TODO dl № algorithm
      state: 'MN',
      rev: '10232017',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Minnesota: 'MN' },
          rev: { 'Rev. 2017.10.23 (0900)': '10232017' },
          district: undefined,
          DAH: true,
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DDB,DAC,DAD,DCS,DBB': ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'D - Single Veh or combination up to 26,000 lbs. GVWR/GCWR':
                    'D',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DAQ,DBD': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', 'Corr. Lenses': 'C' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        // TODO
        const federalFields = `${docType}DAQ${data.DAQ.replaceAll('-', '')}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJMN\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDAW${data.DAW.padStart(3, '0')}\nDAH${data.DAH ? data.DAH : 'NONE'}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under18(data.DBB, data.DBD) ? '\nDDH' + under18(data.DBB, data.DBD) : ''}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZMZMAN\nZMBN\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\x0dANSI 636038090002${docType}0041${fedLengt.padStart(4, '0')}ZM${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 16,
          errorLevel: 3,
          compactionType: 'text',
          encoding: 'simple',
        };

        return [str, config];
      },
    },
    {
      // TODO under 18?!
      state: 'CT',
      rev: '02102017',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Connecticut: 'CT' },
          rev: { 'Rev. 2017.10.02 (0900)': '02102017' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DBB': ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'D - Any non - commercial motor vehicle except motorcycle.':
                    'D',
                  'B - Vehicle GVWR &gt; 26,000 lbs or w/trailer &lt; 10,000 lbs.':
                    'B',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DAQ,DBD': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              // input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'B - Corrective Lenses': 'B',
                  'M - Group B or C passenger vehicle': 'M',
                },
              }),
              select({
                t: fN.DCD,
                a: 'DCD',
                values: {
                  NONE: 'NONE',
                  'M - Motorcycle': 'M',
                  'Q - Fire Apparatus': 'Q',
                  'P - Passengers': 'P',
                  'F - Taxi, Livery, Service Bus, Motor Bus/Coach': 'F',
                  'N - Liquid Bulk/Tank Cargo': 'N',
                },
              }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'

        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJCT\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;

        const stateFields = `ZCZCA\nZCB${data.ZCB ? data.ZCB : '0003977575'}\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\x0dANSI 636006090002${docType}0041${fedLengt.padStart(4, '0')}ZC${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
        };

        return [str, config];
      },
    },
    {
      // TODO under 18?!
      state: 'MO',
      rev: '01272020',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Missouri: 'MO' },
          rev: { 'Rev. 2020.01.27 (0900)': '01272020' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'F - Operator': 'F',
                  'E - For - Hire non - commercial': 'E',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', 'A - Corrective Lenses': 'A' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'

        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJMO\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDAW${data.DAW.padStart(3, '0')}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\n\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZMZMAN\nZMBN\nZMCN\nZMD${data.ZMD ? data.ZMD : 'STCH'}\nZME0\nZMF0\nZMG0\n\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\x0dANSI 636030090002${docType}0041${fedLengt.padStart(4, '0')}ZM${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 14,
          errorLevel: 4,
          compactionType: 'text',
          encoding: 'simple',
        };

        return [str, config];
      },
    },
    {
      // DONE
      state: 'IA',
      rev: '06292017',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Iowa: 'IA' },
          rev: { 'Rev. 2017.06.29 (0900)': '06292017' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - Veh w/26001 GCWR or more towed unit is 10001 GVWR or more':
                    'A',
                  'B - Veh w/26001 GCWR or more towed unit is less than 10001 GVWR':
                    'B',
                  'C - Non - Commercial Vehicle': 'C',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ,DBD': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              // input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', '2B': '2B' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'

        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJIA\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZIZIA\nZIB\nZIC\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\x0dANSI 636018090002${docType}0041${fedLengt.padStart(4, '0')}ZI${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
          code39: true,
        };

        return [str, config];
      },
    },
    {
      // TODO under 21, real id, donor, veteran
      state: 'MT',
      rev: '10072015',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Montana: 'MT' },
          rev: { 'Rev. 2015.10.07 (0800)': '10072015' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DBB': ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: { 'Non - Commerial Vehicle': 'N', D: 'D' },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'Corrective Lens': 'C',
                  'Left Out Mirror': 'L',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJMT\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDAW${data.DAW.padStart(3, '0')}\nDCK${data.DCK}\nDDB${data.DDB}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZMZMA04\nZMB${data.ZMB ? data.ZMB : getRandNum(10000000, 99999999)}\nZMC\nZMD\nZME\nZMFNONE\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\x0dANSI 636008080002${docType}0041${fedLengt.padStart(4, '0')}ZM${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
        };

        return [str, config];
      },
    },
    {
      // TODO under 21
      state: 'NE',
      rev: '04052021',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Nebraska: 'NE' },
          rev: { 'Rev. 2021.04.05 (1000)': '04052021' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - Combination of vehicles, GCWR of 26,001 or more lbs. provided ...':
                    'A',
                  'O - Any non - commercial vehicle except motorcycle.': 'O',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA,DCK': ['DCF'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({ t: fN.DCL, a: 'DCL', values: race }),
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', 'B - Corrective Lenses': 'B' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJNE\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDAW${data.DAW.padStart(3, '0')}\nDAZ${data.DAZ}\nDCL${data.DCL.padEnd(3, ' ')}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZNZNANONE\nZNB${data.DAC}${data.DAD ? ' ' + data.DAD : ''}${data.DCS ? ' ' + data.DCS : ''}\nZNC504\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636054100002${docType}0041${fedLengt.padStart(4, '0')}ZN${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
        };

        return [str, config];
      },
    },
    {
      // TODO under 21
      state: 'RI',
      rev: '01262016',
      country: 'USA',
      fields: {
        top: topFields({
          state: { 'Rhode Island': 'RI' },
          rev: { 'Rev. 2016.01.26 (0800)': '01262016' },
          district: undefined,
          DAH: true,
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: { '10 - Operators License': '10' },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({ t: fN.DCF, a: 'DCF', c: true, ch: { DAJ: ['DCF'] } }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', 'A - Corrective Lenses': 'A' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJRI\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDAW${data.DAW.padStart(3, '0')}\nDAZ${data.DAZ}${data.DAH ? '\nDAH' + data.DAH : ''}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZRZRANONE\nZRB\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636052080002${docType}0041${fedLengt.padStart(4, '0')}ZR${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
        };

        return [str, config];
      },
    },
    {
      // TODO under 21
      state: 'ID',
      rev: '01312023',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Idaho: 'ID' },
          rev: { 'Rev. 2023.01.31 (1009)': '01312023' },
          district: undefined,
          DAH: true,
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: { 'D - Regular operator license': 'D' },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DAQ,DBD': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({ t: fN.DCF, a: 'DCF', c: true, ch: { DAJ: ['DCF'] } }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', 'B - Corrective Lenses': 'B' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJID\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDAH${data.DAH ? data.DAH : 'NONE'}\nDAZ${data.DAZ}\nDAW${data.DAW.padStart(3, '0')}\n${data.DCU ? 'DCU' + data.DCU + '.' : ''}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZIZIADU\nZIB\nZICUSA\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636050100902${docType}0041${fedLengt.padStart(4, '0')}ZI${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 3,
          compactionType: 'text',
          encoding: 'simple',
          small_in: true,
        };

        return [str, config];
      },
    },
    {
      // TODO under 21 donor, vetran, DCA
      state: 'WV',
      rev: '06042019',
      country: 'USA',
      fields: {
        top: topFields({
          state: { 'West Virginia': 'WV' },
          rev: { 'Rev. 2019.06.04 (0900)': '06042019' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: { 'D - Regular operator license': 'D', E: 'E' },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DAQ,DBD': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBB,DBA': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({ t: fN.DCB, a: 'DCB', values: { NONE: 'NONE' } }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'

        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJWV\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}\nDAW${data.DAW.padStart(3, '0')}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZWZWA\nZWB\nZWCY\nZWD\nZWE\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636061090002${docType}0041${fedLengt.padStart(4, '0')}ZW${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
        };

        return [str, config];
      },
    },
    {
      // TODO under 18??
      state: 'AZ',
      rev: '02142014',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Arizona: 'AZ' },
          rev: { 'Rev. 2014.02.14 (0801)': '02142014' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - Combined Vehicle GVWR &gt; 26,000 lbs': 'A',
                  B: 'B',
                  'D - Regular Operators License': 'D',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB,DDA': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD,DDA': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DCS,DAC,DBB': ['DCF'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'B - Corrective Lenses': 'B',
                  'A - Corrective Lenses Required': 'A',
                },
              }),
              select({
                t: fN.DCD,
                a: 'DCD',
                values: {
                  NONE: 'NONE',
                  'Haz/Mat, Tanker Vehicles': 'H',
                  'Double / Triple Trailer Combinations': 'D',
                  'P - Non-School Buses': 'P',
                },
              }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJAZ\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDAW${data.DAW.padStart(3, '0')}\nDAZ${data.DAZ}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZAZAAN\nZAB\nZAC\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${+fedLengt + 41}`;
        const str = `@\n\x1e\rANSI 636026080102${docType}0041${fedLengt.padStart(4, '0')}ZA${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 17,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
        };

        return [str, config];
      },
    },
    {
      // TODO under 18??
      state: 'KS',
      rev: '02242017',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Kansas: 'KS' },
          rev: { 'Rev. 2017.02.24 (0900)': '02242017' },
          district: undefined,
          DAH: true,
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'C - Any vehicle with a GVWR less than 26,001 lbs.': 'C',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              // input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBC,DBA': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', 'B - Corrective Lenses': 'B' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJKS\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA${data.DAH ? '\nDAH' + data.DAH : ''}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;

        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZKZKA\nZKB\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636022090002${docType}0041${fedLengt.padStart(4, '0')}ZK${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
        };

        return [str, config];
      },
    },
    {
      // DONE
      state: 'PA',
      rev: '06072016',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Pennsylvania: 'PA' },
          rev: { 'Rev. 2016.06.07 (0900)': '06072016' },
          district: undefined,
          DAH: true,
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'C - Single/Comb &lt; 26,001': 'C',
                  'M - Motorcycle / Motor Driven Cycle': 'M',
                  'A - Comb &gt; 26,000 / Tow &gt; 10,000': 'A',
                  'B - Single &gt; 26,000 / Tpw &lt; 10,001': 'B',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({ t: fN.DCK, a: 'DCK', c: true, ch: { DAJ: ['DCK'] } }),
              input({ t: fN.DAU, a: 'DAU' }),
              // input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBB': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  '1 - Corrective lenses': '1',
                  'L - No Air Brakes CMV': 'L',
                  'M - No Class A Passenger vehicle': 'M',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ.replaceAll(' ', '')}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJPA\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA${data.DAH ? '\nDAH' + data.DAH : ''}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under18(data.DBB, data.DBD) ? '\nDDH' + under18(data.DBB, data.DBD) : ''}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZPZPA\nZPB00\nZPC${data.ZPC ? data.ZPC : '113'}\nZPD${data.DCD ? data.DCD : 'NONE'}\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636025090002${docType}0041${fedLengt.padStart(4, '0')}ZP${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          code13: true,
        };

        return [str, config];
      },
    },
    {
      // DONE
      state: 'AR',
      rev: '03012018',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Arkansas: 'AR' },
          rev: { 'Rev. 2018.03.01 (0900)': '03012018' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - Combined Vehicle GVWR &gt; 26,000 lbs': 'A',
                  'D - Regular Operators License': 'D',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              // input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({ t: fN.DCF, a: 'DCF', c: true, ch: { DAJ: ['DCF'] } }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'B - Corrective Lenses': 'B',
                  '6 - Passenger NCL Only': '6',
                },
              }),
              select({
                t: fN.DCD,
                a: 'DCD',
                values: { NONE: 'NONE', 'P - Passengers': 'P' },
              }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'

        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJAR\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under18(data.DBB, data.DBD) ? '\nDDH' + under18(data.DBB, data.DBD) : ''}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZAZAANONE\nZAB\nZAC\nZAD\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636021090002${docType}0041${fedLengt.padStart(4, '0')}ZA${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 12,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          code13: true,
        };

        return [str, config];
      },
    },
    {
      // DONE
      state: 'FL',
      rev: '05012019',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Florida: 'FL' },
          rev: { 'Rev. 2019.05.12 (0900)': '05012019' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DAC,DAD,DCS,DBB,DBC': ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - Any Tractor/Trailer with a GVWR of 26,001 lbs. or more':
                    'A',
                  'B - Any single vehicle with a GVWR of 26.001 lbs. or more':
                    'B',
                  'E - Any non - commercial veh with a GVWR &lt; 26.001 lbs. or any RV':
                    'E',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              icon({ t: fN.DDK, abr: 'ZFC', i: 'safe driver' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              // input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({ t: fN.DCF, a: 'DCF', c: true, ch: { DAJ: ['DCF'] } }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              // select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'A - Corr Lenses': 'A',
                  'B - Outside Miror': 'B',
                },
              }),
              select({
                t: fN.DCD,
                a: 'DCD',
                values: { NONE: 'NONE', 'A - MTRCL Also': 'A' },
              }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ.replaceAll('-', '')}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAG${data.DAG}\nDAI${data.DAI}\nDAJFL\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZFZFA\nZFB\nZFC${data.ZFC ? 'SAFE DRIVER' : ''}\nZFD\nZFE\nZFF\nZFG\nZFH\nZFI\nZFJ${data.ZFJ ? data.ZFJ : '00' + getRandNum(100, 999) + getRandNum(100, 999) + getRandNum(10, 99)}\nZFK\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636010090002${docType}0041${fedLengt.padStart(4, '0')}ZF${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 15,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          code13: true,
        };

        return [str, config];
      },
    },
    {
      // DONE
      state: 'MS',
      rev: '02222016',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Mississippi: 'MS' },
          rev: { 'Rev. 2016.02.22 (0800)': '02222016' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  "R - Regular Operator's License": 'R',
                  'A - Commercial License': 'A',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              // input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBC,DBA,DCS,DAC': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({ t: fN.DCB, a: 'DCB', values: { NONE: 'NONE', B: 'B' } }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJMS\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under18(data.DBB, data.DBD) ? '\nDDH' + under18(data.DBB, data.DBD) : ''}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZMZMAN\nZMBN\nZMCN\nZMD${data.DAG}\nZME${data.DAI}\nZMFMS\nZMG${data.DAK.padEnd(9, '0')}\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636051080002${docType}0041${fedLengt.padStart(4, '0')}ZM${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          code13: true,
          last_r: true,
        };

        return [str, config];
      },
    },
    {
      // TODO small char in DCF
      state: 'ND',
      rev: '01082014',
      country: 'USA',
      fields: {
        top: topFields({
          state: { 'North Dakota': 'ND' },
          rev: { 'Rev. 2014.01.08 (0800)': '01082014' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DBB,DCS': ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'D - Any single vehicle less than 26,001 GVWR. May tow a vehicle not in excess':
                    'D',
                  'M - Any two or three wheeled motorcycle.': 'M',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              // input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA,DAQ,DCS,DAC': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', '1-Corrective Lenses': '1' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        //TODO DCF small 1 char
        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD.replaceAll(' ', ',') : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJND\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under18(data.DBB, data.DBD) ? '\nDDH' + under18(data.DBB, data.DBD) : ''}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZNZNA${data.ZNA ? data.ZNA : '272'}\nZNB0\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636034080002${docType}0041${fedLengt.padStart(4, '0')}ZN${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 12,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          code13: true,
          code27: true,
          last_r: true,
          code44: true,
        };

        return [str, config];
      },
    },
    {
      // DONE
      state: 'KY',
      rev: '08312018',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Kentucky: 'KY' },
          rev: { 'Rev. 2018.08.31 (0900)': '08312018' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DBD,DCS': ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: { 'D - Drivers License': 'D' },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              // input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBC,DBA': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', '1 - Corrective lenses': '1' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ.replaceAll('-', '')}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJKY\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under18(data.DBB, data.DBD) ? '\nDDH' + under18(data.DBB, data.DBD) : ''}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;

        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZKZKAREN\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636046090002${docType}0041${fedLengt.padStart(4, '0')}ZK${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 3,
          compactionType: 'numeric',
          encoding: '902 913',
          code13: true,
          code27: true,
          code45: true,
          code46: true,
        };

        return [str, config];
      },
    },
    {
      // DONE
      state: 'TN',
      rev: '12022011',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Tennessee: 'TN' },
          rev: { 'Rev. 2011.12.02 (0600)': '12022011' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: { 'D - Vehicles &lt;26,000 (Operator)': 'D' },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              // input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBC,DBA': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', '01': '01' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEU\nDAC${data.DAC}\nDDFU\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGU\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJTN\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\n\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZTZTAN\nZTBN\nZTC\nZTDN\nZTE1\nZTFN\nZTG00\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636053060002${docType}0041${fedLengt.padStart(4, '0')}ZT${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 3,
          compactionType: 'numeric',
          encoding: '901',
          code13: true,
          code27: true,
          small_in: true,
          last_r3: true,
          last_r: true,
          minRows: 18,
        };

        return [str, config];
      },
    },
    {
      // DONE
      state: 'DE',
      rev: '08022017',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Delawere: 'DE' },
          rev: { 'Rev. 2017.08.22 (0900)': '08022017' },
          district: undefined,
          DAH: true,
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  "D - Operator's vehicles &lt; 26.001 GVWR. Persons &lt; 16 not HazMat.":
                    'D',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DBA': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBC,DBA,QQQ': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({ t: fN.DCB, a: 'DCB', values: { NONE: 'NONE', B: 'B' } }),
              select({
                t: fN.DCD,
                a: 'DCD',
                values: { NONE: 'NONE', 'M - Motorcycle': 'M' },
              }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJDE\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDAW${data.DAW.padStart(3, '0')}\n${data.DAH ? 'DAH' + data.DAH + '\n' : ''}DCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under18(data.DBB, data.DBD) ? '\nDDH' + under18(data.DBB, data.DBD) : ''}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZDZDA\nZDB\nZDC\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636011090002${docType}0041${fedLengt.padStart(4, '0')}ZD${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 12,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          code13: true,
          code27: true,
        };

        return [str, config];
      },
    },
    {
      // TODO under 18??
      state: 'AZ',
      rev: '03012023',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Arizona: 'AZ' },
          rev: { 'Rev. 2023.03.01 (1001)': '03012023' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - Combined Vehicle GVWR &gt; 26,000 lbs': 'A',
                  B: 'B',
                  'D - Regular Operators License': 'D',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB,DDA': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD,DDA': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DCS,DAC,DBB': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'B - Corrective Lenses': 'B',
                  'A - Corrective Lenses Required': 'A',
                },
              }),
              select({
                t: fN.DCD,
                a: 'DCD',
                values: {
                  NONE: 'NONE',
                  'Haz/Mat, Tanker Vehicles': 'H',
                  'Double / Triple Trailer Combinations': 'D',
                  'P - Non-School Buses': 'P',
                },
              }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJAZ\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}\nDAW${data.DAW.padStart(3, '0')}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;

        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZAZAAN\nZACN\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636026100102${docType}0041${fedLengt.padStart(4, '0')}ZA${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 12,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '902 913',
          code27: true,
          small_in: true,
        };

        return [str, config];
      },
    },
    {
      // TODO under 18??
      state: 'IN',
      rev: '07242018',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Indiana: 'IN' },
          rev: { 'Rev. 2018.07.24 (0900)': '07242018' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({ t: fN.DCA, a: 'DCA', values: { NONE: 'NONE' } }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBC,DBA': ['DCF'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'B - Corrective Lenses': 'B',
                  'F - Outside Mirrors': 'F',
                  '9 - Temporary': '9',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJIN\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDAW${data.DAW.padStart(3, '0')}\nDAZ${data.DAZ}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZIZIA\nZIB\nZIC${data.ZIC ? data.ZIC : '334'}\nZID\nZIE\nZIFOP\nZIG\nZIH\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636037090002${docType}0041${fedLengt.padStart(4, '0')}ZI${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 3,
          compactionType: 'numeric',
          encoding: '902 913',
          code13: true,
          code27: true,
        };

        return [str, config];
      },
    },
    {
      // TODO under 18??
      state: 'WA',
      rev: '11122019',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Washington: 'WA' },
          rev: { 'Rev. 2019.11.12 (0900)': '11122019' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({ t: fN.DCA, a: 'DCA', values: { NONE: 'NONE' } }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({ t: fN.DCK, a: 'DCK', c: true, ch: { DAJ: ['DCK'] } }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DAQ,DCJ': ['DCF'] },
              }),
              // TODO DCJ handler
              input({
                t: fN.DCJ,
                a: 'DCJ',
                r: true,
                rh: { 'DAJ,DBD': ['DCJ'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'B - Corrective Lenses must be worn': 'B',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBA${data.DBA}\nDCS${data.DCS}\nDAC${data.DAC}\nDAD${data.DAD ? data.DAD : 'NONE'}\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAU${data.DAU.padStart(3, '0')} in\nDAG${data.DAG}\nDAI${data.DAI}\nDAJWA\nDAK${data.DAK.padEnd(9, '0')}  \nDAQ${data.DAQ}\nDCF${data.DCF}\nDCGUSA\nDDEN\nDDFN\nDDGN\nDCJ${data.DCJ}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}\nDAW${data.DAW}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = ``;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636045090001${docType}0031${fedLengt.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 3,
          compactionType: 'text',
          encoding: '902 913',
          code27: true,
          small_in: true,
        };

        return [str, config];
      },
    },
    {
      // DONE
      state: 'SC',
      rev: '01012018',
      country: 'USA',
      fields: {
        top: topFields({
          state: { 'South Carolina': 'SC' },
          rev: { 'Rev. 2018.01.01 (0900)': '01012018' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  D: 'D',
                  'Vehicles not exceeding 26,000 GVW. Includes Class G and trike. Does not include MTC or MTC w/ sidecar.':
                    'V',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBC,DBA': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({ t: fN.DCL, a: 'DCL', values: race }),
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', 'A - Corrective Lens': 'A' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBA${data.DBA}\nDCS${data.DCS}\nDAC${data.DAC}\nDAD${data.DAD ? data.DAD : 'NONE'}\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAU${data.DAU.padStart(3, '0')} in\nDAG${data.DAG}\nDAI${data.DAI}\nDAJSC\nDAK${data.DAK.padEnd(9, '0')}  \nDAQ${data.DAQ}\nDCF${data.DCF}\nDCGUSA\nDDEU\nDDFU\nDDGU\nDCL${data.DCL ? data.DCL.padEnd(3, ' ') : ''}\nDCM****\n${data.DCB != 'NONE' ? 'DCR' + 'A - Corrective Lens\n' : ''}${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}\nDAW${data.DAW.padStart(3, '0')}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\n\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = ``;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636005090001${docType}0031${fedLengt.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 10,
          errorLevel: 5,
          compactionType: 'text',
          encoding: '901',
          no10code: true,
          paddingWord: 901,
        };
        return [str, config];
      },
    },
    {
      // TODO under 18, 21???
      state: 'NJ',
      rev: '01082020',
      country: 'USA',
      fields: {
        top: topFields({
          state: { 'New Jersey': 'NJ' },
          rev: { 'Rev. 2020.01.08 (0402)': '01082020' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DAC,DAD,DCS,DBB,DBC,DAY': ['DAQ'] },
              }),
              select({ t: fN.DCA, a: 'DCA', values: { D: 'D' } }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({ t: fN.DCK, a: 'DCK', c: true, ch: { DAJ: ['DCK'] } }),
              input({ t: fN.DAU, a: 'DAU' }),
              // input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', '1 - Corrective lenses': '1' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ.replaceAll(' ', '')}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJNJ\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under18(data.DBB, data.DBD) ? '\nDDH' + under18(data.DBB, data.DBD) : ''}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;

        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZNZNAWV\nZNB${data.ZNB ? data.ZNB : '24.00'}\nZNCREN\nZND\nZNE\nZNF${stateEyes[data.DAY]}\nZNGY\nZNH\nZNI\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636036040202${docType}0041${fedLengt.padStart(4, '0')}ZN${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'text',
          encoding: 'simple',
        };

        return [str, config];
      },
    },
    {
      // DONE
      state: 'OR',
      rev: '07092018',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Oregon: 'OR' },
          rev: { 'Rev. 2018.07.09 (0903)': '07092018' },
          district: undefined,
          DAH: true,
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  NONE: 'NONE',
                  'C - Any single vehicle with a GVWR of not more than 26,000 pounds with the...':
                    'C',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({ t: fN.DCK, a: 'DCK', c: true, ch: { DAJ: ['DCK'] } }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({ t: fN.DCF, a: 'DCF', c: true, ch: { DAJ: ['DCF'] } }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'B - Corrective Lenses': 'B',
                  'D - Anatomical Donor': 'D',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ}\nDAC${data.DAC}\nDAD${data.DAD ? data.DAD : 'NONE'}\nDCS${data.DCS}\nDCU${data.DCU ? data.DCU : ''}\nDAG${data.DAG}\nDAH${data.DAH ? data.DAH : ''}\nDAI${data.DAI}\nDAJOR\nDAK${data.DAK.padEnd(9, '0')}  \nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBB${data.DBB}\nDAU${data.DAU.padStart(3, '0')} in\nDAW${data.DAW.padStart(3, '0')}\nDAY${data.DAY}\nDBC${data.DBC}\nDBD${data.DBD}\nDBA${data.DBA}\nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\nDDEU\nDDFU\nDDGU\nDDH${under18(data.DBB, data.DBD) ? '' + under18(data.DBB, data.DBD) : ''}\nDDJ${under21(data.DBB, data.DBD) ? '' + under21(data.DBB, data.DBD) : ''}\nDDK${data.DDK ? '1' : ''}\nDDL${data.DDL ? '1' : ''}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}\nDDD\n\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZOZOA${data.ZOA ? data.DBD : ''}\n\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636029090302${docType}0041${fedLengt.padStart(4, '0')}ZO${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 19,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '902 913',
          code13_2: true,
          last_r3: true,
          small_in: true,
          minRows: 16,
        };
        return [str, config];
      },
    },
    {
      // TODO under 18, 21???
      state: 'PA',
      rev: '03252022',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Pennsylvania: 'PA' },
          rev: { 'Rev. 2022.03.25 (1000)': '03252022' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'C - Single/Comb &lt; 26,001': 'C',
                  'M - Motorcycle / Motor Driven Cycle': 'M',
                  'A - Comb &gt; 26,000 / Tow &gt; 10,000': 'A',
                  'B - Single &gt; 26,000 / Tpw &lt; 10,001': 'B',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({ t: fN.DCK, a: 'DCK', c: true, ch: { DAJ: ['DCK'] } }),
              input({ t: fN.DAU, a: 'DAU' }),
              // input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBB': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  '1 - Corrective lenses': '1',
                  'L - No Air Brakes CMV': 'L',
                  'M - No Class A Passenger vehicle': 'M',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ.replaceAll(' ', '')}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJPA\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under18(data.DBB, data.DBD) ? '\nDDH' + under18(data.DBB, data.DBD) : ''}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;

        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZPZPA\nZPB00\nZPC009\nZPDNONE\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636025100002${docType}0041${fedLengt.padStart(4, '0')}ZP${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          code13: true,
          last_r2: true,
        };

        return [str, config];
      },
    },
    {
      // TODO zip???
      state: 'TX',
      rev: '02232020',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Texas: 'TX' },
          rev: { 'Rev. 2020.02.23 (0900)': '02232020' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DDB': ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - Comb veh w/ GVWR \u2265 26,001 lbs provided towed veh \u2265 10.001 lbs':
                    'A',
                  'C - Single or comb veh w/ GVWR \u2264 26,000 lbs which transports placarded HAZMAT or \u2265 16 pass, including driver':
                    'C',
                  'A - Comb &gt; 26,000 / Tow &gt; 10,000': 'C',
                  'M - Motorcycle': 'M',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD': ['DCF'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({ t: fN.DCL, a: 'DCL', values: race }),
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'A - With corrective lenses': 'A',
                  AB: 'AB',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBA${data.DBA}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAU${data.DAU.padStart(3, '0')} in\nDAG${data.DAG}\nDAI${data.DAI}\nDAJTX\nDAK${data.DAK.padEnd(9, '0')}\nDAQ${data.DAQ}\nDCF${data.DCF}\nDCGUSA\nDAZ${data.DAZ}\nDCK${data.DCK}\nDCL${data.DCL}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}\nDAW${data.DAW.padStart(3, '0')}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\n\r`;
        const fedLengt = `${federalFields.length}`;

        const stateFields = `ZTZTAN\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${+fedLengt + 41}`;
        const str = `@\n\x1e\rANSI 636015090002${docType}0041${fedLengt.padStart(4, '0')}ZT${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 12,
          errorLevel: 5,
          encoding: '902 913',
          compactionType: 'numeric',
          last_r3: true,
          small_in: true,
        };

        return [str, config];
      },
    },
    {
      // DONE
      state: 'CO',
      rev: '10302015',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Colorado: 'CO' },
          rev: { 'Rev. 2015.10.30 (0901)': '10302015' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'R - Any motor vehicle with a GVWR of less than 26,001 lbs. as a single unit or in combination, designed to carry 15 or fewer passengers, including the driver, and does not carrt hazardous material.':
                    'R',
                  C: 'C',
                },
              }),
              // icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              // icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB,DDA': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD,DDA': ['DBA'] },
              }),
            ],
            [
              input({ t: fN.DCK, a: 'DCK', c: true, ch: { DAJ: ['DCK'] } }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({ t: fN.DCF, a: 'DCF', c: true, ch: { DAJ: ['DCF'] } }),
              // TODO DCJ handler
              input({
                t: fN.DCJ,
                a: 'DCJ',
                r: true,
                rh: { 'DAJ,DBD': ['DCJ'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({ t: fN.DCL, a: 'DCL', values: race }),
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', 'C - Corrective Lenses': 'C' },
              }),
              select({
                t: fN.DCD,
                a: 'DCD',
                values: { NONE: 'NONE', 'M - Motorcycle': 'M' },
              }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ.replaceAll('-', '')}\nDCS${data.DCS}\nDDEU\nDAC${data.DAC}\nDDFU\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGU\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJCO\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}\nDAZ${data.DAZ}\nDCJ${data.DCJ}\nDCL${data.DCL.padEnd(3, ' ')}\nDAW${data.DAW.padStart(3, '0')}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZCZCA${data.DCB ? data.DCB : 'NONE'}\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636020090102${docType}0041${fedLengt.padStart(4, '0')}ZC${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 9,
          errorLevel: 4,
          compactionType: 'numeric',
          encoding: '902 913',
          last_r3: true,
          code13: true,
          small_in: true,
        };
        return [str, config];
      },
    },
    {
      // DONE
      state: 'FL',
      rev: '03012020',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Florida: 'FL' },
          rev: { 'Rev. 2020.03.01 (0900)': '03012020' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DAC,DAD,DCS,DBB,DBC': ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - Any Tractor/Trailer with a GVWR of 26,001 lbs. or more':
                    'A',
                  'B - Any single vehicle with a GVWR of 26.001 lbs. or more':
                    'B',
                  'E - Any non - commercial veh with a GVWR &lt; 26.001 lbs. or any RV':
                    'E',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              icon({ t: fN.DDK, abr: 'ZFC', i: 'safe driver' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              // input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({ t: fN.DCF, a: 'DCF', c: true, ch: { DAJ: ['DCF'] } }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              // select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'A - Corr Lenses': 'A',
                  'B - Outside Miror': 'B',
                },
              }),
              select({
                t: fN.DCD,
                a: 'DCD',
                values: { NONE: 'NONE', 'A - MTRCL Also': 'A' },
              }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DAQ${data.DAQ.replaceAll('-', '')}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} IN\nDAG${data.DAG}\nDAI${data.DAI}\nDAJFL\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;

        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZFZFA${data.ZFA ? data.DBD.slice(4, 8) + data.DCF.slice(0, 4) : ''}\nZFB\nZFC${data.ZFC ? 'SAFE DRIVER' : ''}\nZFD\nZFE\nZFF\nZFG\nZFH\nZFI\nZFJ${data.ZFJ ? data.ZFJ : '00' + getRandNum(100, 999) + getRandNum(100, 999) + getRandNum(10, 99)}\nZFK\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636010090002${docType}0041${fedLengt.padStart(4, '0')}ZF${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 15,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          code13: true,
          last_r3: true,
        };

        return [str, config];
      },
    },
    {
      // DONE
      state: 'MD',
      rev: '06202016',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Maryland: 'MD' },
          rev: { 'Rev. 2016.06.20 (0800)': '06202016' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DAD,DAC,DCS,DBB': ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - Any combination of vehicles with GVWR 26,001/more pounds, towing trailer ...':
                    'A',
                  'B - Single vehicles weighing 26,001/more pounds GVWR which ...':
                    'B',
                  'C - Non commercial vehicles weighing 26,000 or less pounds ...':
                    'C',
                  'M - Motorcycles.': 'M',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA': ['DCF'] },
              }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'U - Not for Federal Identification': 'U',
                  'A - May Not Be Used to Purchase Firearm': 'A',
                  'B - Corrective Lenses': 'B',
                  'T - Limited Term Temporary': 'T',
                  J: 'J',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        let federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.toString().padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${data.DCU ? '\nDCU' + data.DCU : ''}\nDAW${data.DAW.padStart(3, '0')}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZMZMA01\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636003080002${docType}0041${fedLengt.padStart(4, '0')}ZM${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 12,
          errorLevel: 3,
          compactionType: 'numeric',
          encoding: '902 913',
          code13: true,
          small_in: true,
          minRows: 22,
        };

        return [str, config];
      },
    },
    {
      //  DONE
      state: 'WI',
      rev: '09012015',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Wisconsin: 'WI' },
          rev: { 'Rev. 2015.09.01 (0801)': '09012015' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DAD,DAC,DCS,DBB,DBC': ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - 26.001 or more GCWR, actual or reg., AND towed unit over 10,000 GVWR':
                    'A',
                  'B - 26,001 or more GVWR, actual reg., towed unit 10,000 or less GVWR':
                    'B',
                  'C - HazMat placarded or designed to or carrying 16 or more people - Need H/P':
                    'C',
                  'D - Non - Commercial Vehicles': 'D',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA': ['DCF'] },
              }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'N - No Operation With Alcohol Level More Than .02': 'N',
                  'C - Corrective Lenses': 'C',
                  B: 'B',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        let federalFields = `${docType}DCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBA${data.DBA}\nDCS${data.DCS}\nDAC${data.DAC}\nDAD${data.DAD ? data.DAD : 'NONE'}\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAU${data.DAU.padStart(3, '0')} IN\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.toString().padEnd(9, '0')}  \nDAQ${data.DAQ.replaceAll('-', '')}\nDCF${data.DCF}\nDCGUSA\nDDEN\nDDFN\nDDGN\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZWZWA${data.ZWA ? data.ZWA : '93523130930'}\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636031080102${docType}0041${fedLengt.padStart(4, '0')}ZW${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 20,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          minRows: 20,
        };

        return [str, config];
      },
    },
    {
      // TODO  under 21 DONE
      state: 'GA',
      rev: '01022019',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Georgia: 'GA' },
          rev: { 'Rev. 2019.01.02 (0901)': '01022019' },
          district: georgiaDistrictSelectField,
          DAH: false,
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  "AP - &gt; 26,001 lbs. GVWR &amp; trailer &gt; 10,001 lbs. Must be accompanied by valid Georgia Driver's license and CDL Class A, B OR C driver":
                    'A',
                  'B - &gt; 26,001 lbs. GVWR &amp; trailer &lt; 10,000 lbs. All lesser vehicles, except motorcycle, with proper endorsements':
                    'B',
                  'C - &lt; 26,000 lbs. GVWR and Trailer &lt; 10,000 lbs. All recreational vehicles included':
                    'C',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DDB,DCK,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DDB,DBD,DBA': ['DCF'] },
              }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'A',
                  'B - Corrective Lenses requied': 'B',
                  'K - Intrastate commerce only, M - No class A passenger buses':
                    'K',
                  'M - No class A passenger buses': 'M',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        let federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEU\nDAC${data.DAC}\nDDFU\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGU\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.toString().padEnd(9, '0').padEnd(11, ' ')}\nDCF${data.DCF}\nDCGUSA${data.DCU ? '\nDCU' + data.DCU : ''}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}\nDAW${data.DAW.padStart(3, '0')}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZGZGAN\nZGBN\nZGD${data.ZGD}\nZGEY\nZGF${data.DCF.slice(0, 11)}\nZGG${data.ZGG ? data.ZGG : '8322396749721'}\nZGH${data.ZGH ? data.ZGH : '045'}\nZGI${data.DAG}\nZGJ${data.DAI}\nZGKGA\nZGL${data.DAK.toString().padEnd(9, '0').padEnd(11, ' ')}\nZGMN\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636055090102${docType}0041${fedLengt.padStart(4, '0')}ZG${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 12,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '902 913',
          small_in: true,
        };

        return [str, config];
      },
    },
    {
      // TODO  under 21 DDK DDL zip??? (race short code) DONE
      state: 'TX',
      rev: '10102016',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Texas: 'TX' },
          rev: { 'Rev. 2016.10.10 (0800)': '10102016' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { 'DAJ,DDB': ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - Comb veh w/ GVWR \u2265 26,001 lbs provided towed veh \u2265 10.001 lbs':
                    'A',
                  'C - Single or comb veh w/ GVWR \u2264 26,000 lbs which transports placarded HAZMAT or \u2265 16 pass, including driver':
                    'C',
                  'A - Comb &gt; 26,000 / Tow &gt; 10,000': 'C',
                  'M - Motorcycle': 'M',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DDB,DAQ,DBD': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DDB,DBD': ['DCF'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({ t: fN.DCL, a: 'DCL', values: race }),
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'A - With corrective lenses': 'A',
                  B: 'B',
                  AB: 'AB',
                },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        const federalFields = `${docType}DCA${data.DCA}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}\nDCB${data.DCB}\nDCD${data.DCD}\nDBA${data.DBA}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAZ${data.DAZ}\nDAU${data.DAU.padStart(3, '0')} IN\nDAW${data.DAW.padStart(3, '0')}\nDCL${data.DCL}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}${under21(data.DBB, data.DBD) ? '\nDDJ' + under21(data.DBB, data.DBD) : ''}\nDAG${data.DAG.padEnd(32, ' ')}\nDAI${data.DAI}\nDAJTX\nDAK${data.DAK.padEnd(9, '0').padEnd(11, ' ')}\nDCK${data.DCK}\nDAQ${data.DAQ}\nDCF${data.DCF}\nDCGUSA\n\r`;
        const fedLengt = `${federalFields.length}`;

        const stateFields = ``;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${+fedLengt + 31}`;
        const str = `@\n\x1e\rANSI 636015080001${docType}0031${fedLengt.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 15,
          errorLevel: 3,
          compactionType: 'numeric',
          encoding: '901',
          code13: true,
          last_r3: true,
          small_in: true,
          code46: true,
          minRows: 18,
        };

        return [str, config];
      },
    },
    {
      // TODO  under 21 DDK DDL DONE office code
      state: 'LA',
      rev: '02102015',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Louisiana: 'LA' },
          rev: { 'Rev. 2015.02.10 (0800)': '02102015' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  "Driver's license": 'D',
                  'CDL - A license': 'C',
                  E: 'E',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA': ['DCF'] },
              }),
              input({
                t: fN.DCJ,
                a: 'DCJ',
                c: true,
                ch: { 'DAJ,DBD': ['DCJ'] },
              }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', 'Corr Lens': 'C', '01': '01' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        let federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEU\nDAC${data.DAC}\nDDFU\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGU\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.toString().padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA${data.DCU ? '\nDCU' + data.DCU : ''}\nDCJ${data.DCJ}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}\nDAW${data.DAW.padStart(3, '0')}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\nDCK${data.DCK}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZLZLA${data.ZLA ? data.ZLA : '53'}\nZLB${data.ZLB ? data.ZLB : '0'}\nZLC${data.ZLC ? data.ZLC : '0'}\nZLD\nZLE${data.ZLE ? data.ZLE : '0'}\nZLF${data.ZLF ? data.ZLF : '0'}\nZLG\nZLH\nZLI${data.ZLI ? data.ZLI : '321'}\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636007080002${docType}0041${fedLengt.padStart(4, '0')}ZL${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          code13: true,
          small_in: true,
          // minRows: 22
        };

        return [str, config];
      },
    },
    {
      // TODO under 21 DDK DDL DONE
      state: 'AL',
      rev: '11012014',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Alabama: 'AL' },
          rev: { 'Rev. 2014.11.01 (0401)': '11012014' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - Combined Vehicle GVWR &gt; 26,000 lbs': 'A',
                  'B - Single Vehicle &gt; GVWR 26,000 lbs': 'B',
                  'D - Regular Operators License': 'D',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA': ['DCF'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: {
                  NONE: 'NONE',
                  'A - Corrective Lenses': 'A',
                  "Y - Learner's License": 'Y',
                },
              }),
              select({
                t: fN.DCD,
                a: 'DCD',
                values: {
                  NONE: 'NONE',
                  'P - Passenger Vehicles': 'P',
                  'N - Tanker Vehicles': 'N',
                  'T - Double / Triple Trailer Combinations': 'T',
                },
              }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        let federalFields = `${docType}DCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBA${data.DBA}\nDCS${data.DCS}\nDAC${data.DAC}\nDAD${data.DAD ? data.DAD : 'NONE'}\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAU${data.DAU.padStart(3, '0')} in\ndag${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.toString().padEnd(9, '0')}  \nDAQ${data.DAQ}\nDCF${data.DCF}\nDCGUSA\nDDEU\nDDFU\nDDGU\nDCE${lbsToDCEConvert(data.DAW)}\nDAZ${data.DAZ}\nDCK${data.DCK}\nDCU\nDCJ\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZAZAAY\nZABN\nZAC\nZADN\nZAE\nZAF${data.ZAF ? data.ZAF : ''}\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636033040102${docType}0041${fedLengt.padStart(4, '0')}ZA${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 14,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          code13: true,
          small_in: true,
          last_r3: true,
          minRows: 32,
        };

        return [str, config];
      },
    },
    {
      // TODO under 21 DDK DDL DONE
      state: 'VA',
      rev: '12102008',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Virginia: 'VA' },
          rev: { 'Rev. 2008.12.10 (0300)': '12102008' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  NONE: 'NONE',
                  'D - Operator License': 'D',
                  'M - Motorcycle License': 'M',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ,DDB': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA,DDB': ['DCF'] },
              }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', C: 'C', 'X - Corrective Lenses': 'X' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        let federalFields = `${docType}DCA${data.DCA.padEnd(4, ' ')}\nDCB${data.DCB.padEnd(10, ' ')}\nDCD${data.DCD.padEnd(5, ' ')}\nDBA${data.DBA}\nDCS${data.DCS.padEnd(40, ' ')}\nDCT${(data.DAC + (data.DAD ? ',' + data.DAD : '')).padEnd(80, ' ')}\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAU${data.DAU.padStart(3, '0')} in\ndag${data.DAG.padEnd(35, ' ')}\nDAI${data.DAI.padEnd(20, ' ')}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(9, '0')}  \nDAQ${data.DAQ.padEnd(25, ' ')}\nDCF${data.DCF.padEnd(25, ' ')}\nDCGUSA\nDCH${data.DCA.padEnd(4, ' ')}\nDDC00000000\nDDB${data.DDB}\nDDDN\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DCK${data.DCK.padEnd(25, ' ')}\nDCA${data.DCA.padEnd(4, ' ')}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = ``;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636000030001${docType}0031${fedLengt.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 17,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          small_in: true,
          minRows: 21,
        };

        return [str, config];
      },
    },
    {
      // TODO  under 18, 19  DONE
      state: 'OH',
      rev: '07012018',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Ohio: 'OH' },
          rev: { 'Rev. 2018.07.01 (0901)': '07012018' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: { 'D License to operate a motor vehicle': 'D' },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
              input({ t: fN.DAX, a: 'DAX' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA': ['DCF'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'A', 'B - Corrective Lenses': 'B' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        let federalFields = `${docType}DBA${data.DBA}\nDCS${data.DCS}\nDAC${data.DAC}\nDAD${data.DAD ? data.DAD : 'NONE'}\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAU${data.DAU.padStart(3, '0')} in\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.toString().padEnd(9, '0')}  \nDAQ${data.DAQ}\nDCF${data.DCF}\nDCGUSA\nDDEN\nDDFN\nDDGN\nDAZ${data.DAZ}\nDCIOHIO\nDCJ\nDCU${data.DCU ? data.DCU : ''}\nDCE${lbsToDCEConvert(data.DAW)}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}\nDDC\nDAW${data.DAW.padStart(3, '0')}\nDDL${data.DDL ? '1' : ''}\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDAH\nDCK${data.DCK}\nDCN\nDCO\nDAX${data.DAX.padStart(3, '0')}\nDDH\nDDI\nDDJ${under21(data.DBB, data.DBD) ? under21(data.DBB, data.DBD) : ''}\nDDK${data.DDK ? '1' : ''}\n\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZOZOAN\nZOBN\nZOE${under21(data.DBB, data.DBD) ? under21(data.DBB, data.DBD) : ''}\nZOC\nZOD\nZOF\nZOG\nZOH\nZOI\nZOK\nZOL\n\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636023090102${docType}0041${fedLengt.padStart(4, '0')}ZO${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;
        console.log(str.length);
        const config: BarcodeGenerateConfig = {
          columns: 16,
          errorLevel: 4,
          compactionType: 'numeric',
          encoding: '902 913',
          small_in: true,
          code13: true,
          last_r3: true,
          minRows: 20,
        };

        return [str, config];
      },
    },
    {
      // TODO  under 21  DDK DDL DONE
      state: 'NM',
      rev: '06162016',
      country: 'USA',
      fields: {
        top: topFields({
          state: { 'New Mexico': 'NM' },
          rev: { 'Rev. 2017.08.29 (0800)': '06162016' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'A - Any vehicle or combination of vehicles except motorcycles':
                    'A',
                  'Class C -Veh w/GVWR ≤ 26000, No M/C': 'C',
                  D: 'D',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DAQ': ['DCF'] },
              }),
              // select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', 'B-Corrective Lenses': 'B' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'

        let federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEU\nDAC${data.DAC}\nDDFU\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGU\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.toString().padEnd(9, '0')}  \nDCFunavl\nDCGUSA\nDAW${data.DAW.padStart(3, '0')}\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZNZNA\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636009080002${docType}0041${fedLengt.padStart(4, '0')}ZN${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 3,
          compactionType: 'text',
          encoding: '901',
          code13: true,
          small_in: true,
          // last_r3: true,
          // last_r: true,
          code45: true,
          code97: true,
          minRows: 18,
        };

        return [str, config];
      },
    },
    {
      // TODO  under 21 DONE
      state: 'NY',
      rev: '09282017',
      country: 'USA',
      fields: {
        top: topFields({
          state: { 'New York': 'NY' },
          rev: { 'Rev. 2017.08.29 (0303)': '09282017' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({ t: fN.DCA, a: 'DCA', values: { D: 'D' } }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ,DDB': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA,DDB': ['DCF'] },
              }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', 'B Corrective Lenses': 'B' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        let federalFields = `${docType}DCA${data.DCA.padEnd(4, ' ')}\nDCB${data.DCB.padEnd(10, ' ')}\nDCD${data.DCD.padEnd(5, ' ')}\nDBA${data.DBA}\nDCS${data.DCS.padEnd(25, ' ')}\nDCT${(data.DAC + (data.DAD ? ',' + data.DAD : '')).padEnd(25, ' ')}\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAU${Math.floor(+data.DAU / 12)}${(+data.DAU - Math.floor(+data.DAU / 12) * 12).toString().padStart(2, '0')}   \nDAG${data.DAG.padEnd(25, ' ')}\nDAI${data.DAI.padEnd(20, ' ')}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(9, '0').padEnd(11, ' ')}\nDAQ${data.DAQ.replaceAll(' ', '')}\nDCF${data.DCF}\nDCGUSA\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}\nDDD0\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZNZNA${[data.DCS, data.DAC, data.DAD]
          .filter((e) => e)
          .join('@')
          .padEnd(20, ' ')
          .slice(
            0,
            20,
          )}\nZNB${data.ZNB ? data.ZNB : 'Eud"=ZjE*F1l8HtP"])r6$kn"qYIPrV?7G7dm!r*'}\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636001030302${docType}0041${fedLengt.padStart(4, '0')}ZN${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stringToHex(stateFields)}`;

        const config: BarcodeGenerateConfig = {
          columns: 20,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          code39: true,
          withSignature: true,
          minRows: 18,
        };

        return [str, config];
      },
    },
    {
      // TODO under 21 DONE
      state: 'NY',
      rev: '03072022',
      country: 'USA',
      fields: {
        top: topFields({
          state: { 'New York': 'NY' },
          rev: { 'Rev. 2022.03.07 (1004)': '03072022' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: { D: 'D', 'Class C -Veh w/GVWR ≤ 26000, No M/C': 'C' },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ,DDB': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA': ['DCF'] },
              }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', 'B - Corrective Lenses': 'B' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        let federalFields = `${docType}DCA${data.DCA.padEnd(4, ' ')}\nDCB${data.DCB.padEnd(10, ' ')}\nDCD${data.DCD.padEnd(5, ' ')}\nDBA${data.DBA}\nDCS${data.DCS.padEnd(25, ' ')}\nDAC${data.DAC.padEnd(25, ' ')}\nDAD${data.DAD.padEnd(25, ' ')}\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAU${Math.floor(+data.DAU / 12)}${(+data.DAU - Math.floor(+data.DAU / 12) * 12).toString().padStart(2, '0')}   \nDAG${data.DAG.padEnd(25, ' ')}\nDAI${data.DAI.padEnd(20, ' ')}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(9, '0').padEnd(11, ' ')}\nDAQ${data.DAQ.replaceAll(' ', '')}\nDCF${data.DCF}\nDCGUSA\nDDEU\nDDFU\nDDGU\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}\nDDD0\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZNZNA${[data.DCS, data.DAC, data.DAD]
          .filter((e) => e)
          .join('@')
          .padEnd(
            20,
            ' ',
          )}\nZNB${data.ZNB ? data.ZNB : "0LZ$c@?g8H_Bs,>G[.&;]F*_&b]5LLB(\\n_*>29#Mkng9![.R&Z@_,rODLE`Tn((_W+4Zm#<-qOB'YGg2+eZO;_!M "}\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636001100402${docType}0041${fedLengt.padStart(4, '0')}ZN${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stringToHex(stateFields)}`;

        const config: BarcodeGenerateConfig = {
          columns: 19,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          code39: true,
          withSignature: true,
          minRows: 21,
        };

        return [str, config];
      },
    },
    {
      // TODO under 21  DDK DDL DONE
      state: 'NH',
      rev: '06092016',
      country: 'USA',
      fields: {
        top: topFields({
          state: { 'New Hampshire': 'NH' },
          rev: { 'Rev. 2016.06.09 (0900)': '06092016' },
          district: undefined,
          DAH: true,
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: { 'D - NON COMMERCIAL CLASS D': 'D' },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA,DCK': ['DCF'] },
              }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', 'B - CORR LENS': 'B' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        let federalFields = `${docType}DAQ${data.DAQ}\nDCS${data.DCS}\nDDEN\nDAC${data.DAC}\nDDFN\nDAD${data.DAD ? data.DAD : 'NONE'}\nDDGN\nDCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBD${data.DBD}\nDBB${data.DBB}\nDBA${data.DBA}\nDBC${data.DBC}\nDAU${data.DAU.padStart(3, '0')} in\nDAY${data.DAY}\nDAG${data.DAG}\nDAH${data.DAH ? data.DAH : 'NONE'}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(9, '0')}  \nDCF${data.DCF}\nDCGUSA\nDCK${data.DCK}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}${data.DDK ? '\nDDK1' : ''}${data.DDL ? '\nDDL1' : ''}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = ``;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636039090001${docType}0031${fedLengt.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 12,
          errorLevel: 3,
          compactionType: 'numeric',
          encoding: '901',
          small_in: true,
          withSignature: true,
          code44: true,
          code45: true,
          last_r3: true,
        };

        return [str, config];
      },
    },
    {
      // TODO under 21 DDK DDL DONE
      state: 'NV',
      rev: '10102008',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Nevada: 'NV' },
          rev: { 'Rev. 2008.10.10 (0300)': '10102008' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: {
                  'C - Cars/Vans/Pickups; may tow a veh < 10,000 lbs': 'C',
                },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              // input({ t: fN.DCK, a: 'DCK', c: true, ch: { 'DAJ,DBD,DAQ': ['DCK'] } }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA,DDB': ['DCF'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairsFull }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', B: 'B', F: 'F' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        let federalFields = `${docType}DCA${data.DCA}\nDCB${data.DCB}\nDCD${data.DCD}\nDBA${data.DBA}\nDCS${data.DCS}\nDCT${data.DAC}${data.DAD ? ' ' + data.DAD : ''}\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAU${data.DAU.padStart(3, '0')} in\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(9, '0')}  \nDAQ${data.DAQ}\nDCF${data.DCF}\nDCGUSA\nDCHNONE\nDAH${data.DAH ? data.DAH : ''}\nDAZ${data.DAZ}\nDCE${lbsToDCEConvert(data.DAW).toString()}\nDCK${data.DCK}\nDCU${data.DCU ? data.DCU : ''}\n\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZNZNAN\nZNB${data.DDB}\nZNC${Math.floor(+data.DAU / 12)}'${(+data.DAU - Math.floor(+data.DAU / 12) * 12).toString().padStart(2, '0')}''\nZND${data.DAW.padStart(3, '0')}\nZNENCDL\nZNFNCDL\nZNGS\nZNH${data.DCK.slice(0, -2)}\nZNI${data.ZNI ? data.ZNI : '00000007560'}\n\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636049030002${docType}0041${fedLengt.padStart(4, '0')}ZN${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 13,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          code13: true,
          small_in: true,
          last_r3: true,
          sn16: true,
          withSignature: true,
          minRows: 31,
        };

        return [str, config];
      },
    },
    {
      // TODO under 21 DDK DDL DONE
      state: 'VA',
      rev: '04222023',
      country: 'USA',
      fields: {
        top: topFields({
          state: { Virginia: 'VA' },
          rev: { 'Rev. 2023.04.22 (1002)': '04222023' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({ t: fN.DCA, a: 'DCA', values: { DM2: 'DM2' } }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA,DDB': ['DCF'] },
              }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({
                t: fN.DCB,
                a: 'DCB',
                values: { NONE: 'NONE', B: 'B', F: 'F' },
              }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE', S: 'S' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        let federalFields = `${docType}DCA${data.DCA.padEnd(4, ' ')}\nDCB${data.DCB.padEnd(10, ' ')}\nDCD${data.DCD.padEnd(5, ' ')}\nDBA${data.DBA}\nDCS${data.DCS.padEnd(40, ' ')}\nDAC${data.DAC.padEnd(40, ' ')}\nDAD${data.DAD.padEnd(40, ' ')}\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAU${data.DAU.padStart(3, '0')} in\nDAG${data.DAG.padEnd(35, ' ')}\nDAI${data.DAI.padEnd(20, ' ')}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(9, '0')}\nDAQ${data.DAQ.padEnd(12, ' ')}\nDCF${data.DCF.padEnd(12, ' ')}\nDCGUSA\nDDEU\nDDFU\nDDGU\nDCK${data.DCK}\nDCU${data.DCU ? data.DCU.padEnd(5, ' ') : '     '}\n${data.DDA ? 'DDA' + data.DDA + '\n' : ''}DDB${data.DDB}\nDDC00000000\nDDD0\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZVZVA0Lc*e!5sfc=>>^q1T+D+%;h,qL/#B\\jIu8%RX]-*Ze.!4YQ>sJ\\]MQGTRYSFpEDXir@jIUnE<i4ZKC<s:GG$jr*b3f\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636000100202${docType}0041${fedLengt.padStart(4, '0')}ZV${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stringToHex(stateFields)}`;

        const config: BarcodeGenerateConfig = {
          columns: 19,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          last_r3: true,
          withSignature: true,
          minRows: 25,
          code42: true,
          code46_2: true,
        };
        return [str, config];
      },
    },

    {
      // TODO under 21
      state: 'ON',
      country: 'CAN',
      rev: '08292017',
      fields: {
        top: topFields({
          state: { Ontario: 'ON' },
          rev: { 'Rev. 2017.08.29 (0900)': '08292017' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: { G2: 'G2', A: 'A', GM: 'GM' },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA': ['DCF'] },
              }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({ t: fN.DCB, a: 'DCB', values: { NONE: 'NONE' } }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE', Z: 'Z' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        //
        let federalFields = `${docType}DCA${data.DCA}\nDCB${data.DCB ? data.DCB : ''}\nDCD${data.DCD ? data.DCD : ''}\nDBA${data.DBA}\nDCS${data.DCS}\nDAC${data.DAC}\nDAD${data.DAD ? data.DAD : ''}\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAU${data.DAU.padStart(3, '0')} cm\nDAG${data.DAG}\nDAI${data.DAI}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(11, ' ')}\nDAQ${data.DAQ}\nDCF${data.DCF}\nDCGCAN\nDDEN\nDDFN\nDDGN\nDCK${data.DCK}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZOZOA${[data.DCS, data.DAC, data.DAD].filter((e) => e).join(',')}\nZOBY\nZOC\nZOD\nZOE\nZOZ${data.ZOZ ? data.ZOZ : 'B4339-01177-40720'}\r`;
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 636012090002${docType}0041${fedLengt.padStart(4, '0')}ZO${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stateFields}`;

        const config: BarcodeGenerateConfig = {
          columns: 23,
          errorLevel: 7,
          compactionType: 'numeric',
          encoding: '902 913',
          // small_in: true,
          minRows: 20,
          last_r3: true,
        };

        return [str, config];
      },
    },
    {
      // TODO under 21
      state: 'AB',
      country: 'CAN',
      rev: '08292017',
      fields: {
        top: topFields({
          state: { Alberta: 'AB' },
          rev: { 'Rev. 2017.08.29 (0901)': '08292017' },
        }),
        down: {
          DL: [
            downChoisers(),
            [
              input({
                t: fN.DAQ,
                a: 'DAQ',
                p: '[A-Z1-9]+',
                r: true,
                rh: { DAJ: ['DAQ'] },
              }),
              select({
                t: fN.DCA,
                a: 'DCA',
                values: { G2: 'G2', A: 'A', '5': '5' },
              }),
              icon({ t: fN.DDL, abr: 'DDK', i: 'heart' }),
              icon({ t: fN.DDK, abr: 'DDL', i: 'medal' }),
              calendar({
                t: fN.DBD,
                a: 'DBD',
                r: true,
                rh: { 'DAJ,DBB': ['DBD', 'DBA'] },
              }),
              calendar({
                t: fN.DBA,
                a: 'DBA',
                c: true,
                ch: { 'DAJ,DBB,DBD': ['DBA'] },
              }),
            ],
            [
              input({
                t: fN.DCK,
                a: 'DCK',
                c: true,
                ch: { 'DAJ,DBD,DAQ': ['DCK'] },
              }),
              input({ t: fN.DAU, a: 'DAU' }),
              input({ t: fN.DAW, a: 'DAW' }),
            ],
            [
              input({
                t: fN.DCF,
                a: 'DCF',
                c: true,
                ch: { 'DAJ,DBD,DBA': ['DCF'] },
              }),
              select({ t: fN.DAZ, a: 'DAZ', values: hairs }),
              select({ t: fN.DAY, a: 'DAY', values: eyes }),
            ],
            [
              select({ t: fN.DCB, a: 'DCB', values: { NONE: 'NONE' } }),
              select({ t: fN.DCD, a: 'DCD', values: { NONE: 'NONE', Z: 'Z' } }),
            ],
          ],
        },
      },

      generate(data) {
        const docType = data.QQQ; //'DL'
        let federalFields = `${docType}DCA${data.DCA.padEnd(6, ' ')}\nDCB${data.DCB.padEnd(12, ' ')}\nDCD${data.DCD.padEnd(5, ' ')}\nDBA${data.DBA}\nDCS${data.DCS.padEnd(40, ' ')}\nDAC${CamelCase(data.DAC).padEnd(40, ' ')}\nDAD${CamelCase(data.DAD).padEnd(40, ' ')}\nDBD${data.DBD}\nDBB${data.DBB}\nDBC${data.DBC}\nDAY${data.DAY}\nDAU${data.DAU.padStart(3, '0')} cm\nDAG${data.DAG.split(
          ' ',
        )
          .map((el) => (el.length == 2 ? el : CamelCase(el)))
          .join(' ')
          .padEnd(
            35,
            ' ',
          )}\nDAI${CamelCase(data.DAI).padEnd(20, ' ')}\nDAJ${data.DAJ}\nDAK${data.DAK.padEnd(11, ' ')}\nDAQ${data.DAQ.padEnd(25, ' ')}\nDCF${data.DCF.padEnd(25, ' ')}\nDCGCAN\nDDEN\nDDFN\nDDGN\nDAH                                   \nDAZ${data.DAZ.padEnd(12, ' ')}\nDAX${data.DAW.padStart(3, '0')}\r`;
        const fedLengt = `${federalFields.length}`;
        const stateFields = `ZAZAA0LPsb8)r)T,>J#L'Wm'mn;Y9K;#^pRU)a&oe^:bb(14S;![&"I8nHAb8X-p,QcX;TG?Q#>DZp%)]EVtISK=@*.9$~\r`;
        //
        const stateLenght = `${stateFields.length}`;
        const stateOffset = `${federalFields.length + 41}`;
        const str = `@\n\x1e\rANSI 604432090102${docType}0041${fedLengt.padStart(4, '0')}ZA${stateOffset.padStart(4, '0')}${stateLenght.padStart(4, '0')}${federalFields}${stringToHex(stateFields)}`;

        const config: BarcodeGenerateConfig = {
          columns: 20,
          errorLevel: 5,
          compactionType: 'numeric',
          encoding: '901',
          code39: true,
          minRows: 23,
          withSignature: true,
        };

        return [str, config];
      },
    },
  ];

  async getFields(
    data: GetDataDto,
  ): Promise<DLConfigFieldsToPresent | DLDownFields> {
    return new PresentFields(
      [data.country, data.DAJ, data.DDB, data.type, data.flag],
      this.configs,
    ).getData();
  }
}

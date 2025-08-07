import { HttpException, Injectable } from '@nestjs/common';
import {
  BarcodeConfigFields,
  BarcodeConfigs,
  DLConfigFieldsToPresent,
  DLDownFields,
} from 'src/barcode-config/dto/configs.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { GetDataDto } from './dto/get-data.dto';
import { BarcodeConfigService } from 'src/barcode-config/barcode-config.service';
import { fN } from 'src/shared/const/fields-names.const';

@Injectable()
export class BarcodeService {
  constructor(
    private prisma: PrismaService,
    private configService: BarcodeConfigService,
  ) {}
  async getFields(
    data: GetDataDto,
  ): Promise<DLConfigFieldsToPresent | DLDownFields> {
    try {
      const {
        country = 'USA',
        DAJ = undefined,
        DDB = undefined,
        type = 'DL',
        flag = false,
      } = data;

      // 1) fetch all the configs for this country
      const options = await this.configService.findOptionsByCountry(country);

      // 2) pick the base fields (same as you had)
      const baseFields = await this.configService.getFields(options, DAJ, DDB);
      const topRows = baseFields.top;
      const downRows = baseFields.down?.ID
        ? baseFields.down[type]
        : baseFields.down.DL;

      // 3) build a map of all states -> codes
      const stateMap = options
        .map((o) => o.state) // e.g. ['CA','NY',…]
        .filter((s, i, arr) => arr.indexOf(s) === i) // unique
        .reduce(
          (acc, code) => {
            // find the human-readable label from one of its configs
            const label = Object.entries(
              options
                .find((o) => o.state === code)!
                .fields.top.flat()
                .find((el) => !Array.isArray(el) && el.title === fN.DAJ)!
                .values as Record<string, string>,
            ).find(([lab, cd]) => cd === code)![0];
            acc[label] = code;
            return acc;
          },
          {} as Record<string, string>,
        );

      if (DAJ && !Object.values(stateMap).includes(DAJ)) {
        throw new HttpException('Invalid state', 400);
      }

      // 4) decide which state we’re on
      const currState = DAJ ?? Object.values(stateMap)[0];

      // 5) build a map of all revisions for that state
      const revMap = options
        .filter((o) => o.state === currState)
        .map((o) => o.rev)
        .filter((r, i, arr) => arr.indexOf(r) === i)
        .sort((a, b) => b.localeCompare(a)) // newest first
        .reduce(
          (acc, rev) => {
            const label = Object.entries(
              options
                .find((o) => o.state === currState && o.rev === rev)!
                .fields.top.flat()
                .find((el) => !Array.isArray(el) && el.title === fN.DDB)!
                .values as Record<string, string>,
            ).find(([lab, cd]) => cd === rev)![0];
            acc[label] = rev;
            return acc;
          },
          {} as Record<string, string>,
        );

      const currRev = DDB ?? Object.values(revMap)[0];
      if (DDB && !Object.values(revMap).includes(DDB)) {
        throw new HttpException('Invalid revision', 400);
      }

      // 6) walk the “top” rows and inject them
      topRows.forEach((row) => {
        row.forEach((el) => {
          if (!Array.isArray(el) && el.title === fN.DAJ) {
            el.values = { ...stateMap };
            if ('selected' in el) {
              el.selected = Object.entries(stateMap).find(
                ([, code]) => code === currState,
              )![0];
            }
          }
          if (!Array.isArray(el) && el.title === fN.DDB) {
            el.values = { ...revMap };
            if ('selected' in el)
              el.selected = Object.entries(revMap).find(
                ([, code]) => code === currRev,
              )![0];
          }
        });
      });

      // 7) if you only wanted “down” fields (flag), return them now
      if (flag && downRows) {
        return downRows;
      }
      return [...topRows, ...downRows!] as unknown as DLConfigFieldsToPresent;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new HttpException('Error fetching barcode fields', 500);
    }
  }
}

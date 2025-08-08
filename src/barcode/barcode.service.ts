import { HttpException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/shared/services/prisma.service';
import { BarcodeConfigService } from 'src/barcode-config/barcode-config.service';
import { fN } from 'src/shared/const/fields-names.const';
import { GetRandomDto } from './dto/get-random.dto';
import { Sex } from '@prisma/client';

@Injectable()
export class BarcodeService {
  constructor(
    private prisma: PrismaService,
    private configService: BarcodeConfigService,
  ) {}
  async getRandom(data: GetRandomDto): Promise<Record<string, string>> {
    const operation = data.output.join(',');
    if (operation === 'DAG,DAI,DAK') {
      const DAJ = data.input.DAJ;
      if (!DAJ || typeof DAJ !== 'string') {
        throw new HttpException(
          'DAJ is required for operation DAG,DAI,DAK and must be a string',
          400,
        );
      }
      const row = await this.getRandomAddressByState(DAJ);
      const result: Record<string, string> = {};

      for (const key of ['DAG', 'DAI', 'DAK'] as const) {
        const raw = row[key];
        result[fN[key]] = raw[0].toUpperCase() + raw.slice(1).toLowerCase();
      }
      return result;
    } else if (operation === 'DAC,DAD,DCS') {
      const DBC: Sex = data.input.DBC == 1 ? 'M' : 'F';
      const row: Record<string, string> = await this.getRandomUserBySex(DBC);
      const result: Record<string, string> = {};
      for (const key of ['DAC', 'DAD', 'DCS'] as const) {
        result[fN[key]] =
          row[key][0].toUpperCase() + row[key].slice(1).toLowerCase();
      }
      return result;
    } else if (operation === 'DBB') {
      const curDate: Date = new Date();
      let maxDays: Date = new Date(
        curDate.getFullYear() - 65,
        curDate.getMonth(),
        curDate.getDate(),
      );
      let minDays: Date = new Date(
        curDate.getFullYear() - 21,
        curDate.getMonth(),
        curDate.getDate(),
      );
      const a: Date = new Date(
        maxDays.getTime() +
          Math.random() * (minDays.getTime() - maxDays.getTime()),
      );
      let result: Record<string, string> = {
        [fN['DBB']]:
          `${String(a.getMonth() + 1).padStart(2, '0')}${String(a.getDate()).padStart(2, '0')}${a.getFullYear()}`,
      };
      return result;
    } else if (operation === 'DAQ') {
      const { dlNumberGeneration } = await import(
        'src/barcode/helper/dl-generation.helper'
      );
      const num = await dlNumberGeneration(data.input);
      const result: Record<string, string> = {};
      for (const key of data.output) {
        result[fN[key]] = num;
      }
      return result;
    } else if (operation === 'DBD,DBA') {
      const { dlIssueExpirationDates } = await import(
        'src/barcode/helper/dl-issue-expiration-dates.helper'
      );
      return await dlIssueExpirationDates(data.input as Record<string, string>);
    } else if (operation === 'DCJ') {
      const { auditInfo } = await import(
        'src/barcode/helper/audit-info.helper'
      );
      return await auditInfo(data.input as Record<string, string>);
    } else {
      throw new HttpException(`Unsupported operation: ${operation}`, 400);
    }
  }

  async getRandomAddressByState(
    state: string,
  ): Promise<{ DAG: string; DAI: string; DAK: string }> {
    const total = await this.prisma.address.count({ where: { DAJ: state } });
    if (total === 0) {
      throw new HttpException(`No addresses for state=${state}`, 404);
    }
    const skip = Math.floor(Math.random() * total);

    const rows = await this.prisma.address.findMany({
      where: { DAJ: state },
      select: { DAG: true, DAI: true, DAK: true },
      orderBy: { id: 'asc' },
      skip,
      take: 1,
    });

    return rows[0]!;
  }
  async getRandomUserBySex(
    sex: Sex,
  ): Promise<{ DAC: string; DAD: string; DCS: string }> {
    const total = await this.prisma.names.count({ where: { DBC: sex } });
    if (total === 0) {
      throw new HttpException(`No names for sex=${sex}`, 400);
    }

    const pickDAC = (async () => {
      const skip = Math.floor(Math.random() * total);
      const [row] = await this.prisma.names.findMany({
        where: { DBC: sex },
        select: { DAC: true },
        orderBy: { id: 'asc' },
        skip,
        take: 1,
      });
      return row!.DAC;
    })();

    const pickDAD = (async () => {
      const skip = Math.floor(Math.random() * total);
      const [row] = await this.prisma.names.findMany({
        where: { DBC: sex },
        select: { DAD: true },
        orderBy: { id: 'asc' },
        skip,
        take: 1,
      });
      return row!.DAD;
    })();

    const pickDCS = (async () => {
      const skip = Math.floor(Math.random() * total);
      const [row] = await this.prisma.names.findMany({
        where: { DBC: sex },
        select: { DCS: true },
        orderBy: { id: 'asc' },
        skip,
        take: 1,
      });
      return row!.DCS;
    })();

    const [DAC, DAD, DCS] = await Promise.all([pickDAC, pickDAD, pickDCS]);
    return { DAC, DAD, DCS };
  }
}

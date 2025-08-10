import { HttpException, Injectable, Logger } from '@nestjs/common';

import { PrismaService } from 'src/shared/services/prisma.service';
import { BarcodeConfigService } from 'src/barcode-config/barcode-config.service';
import { fN } from 'src/shared/const/fields-names.const';
import { GetRandomDto } from './dto/get-random.dto';
import { Barcode, BarcodeType, Sex } from '@prisma/client';
import { GetCalculateDto } from './dto/get-calculate.dto';
import { GeneratePDF417Dto } from './dto/generate-pdf417.dto';
import * as util from 'util';
import { execFile } from 'child_process';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { GenerateCode128Dto } from './dto/generate-code128.dto';

@Injectable()
export class BarcodeService {
  private readonly BARCODE_URL: string = '';
  private readonly logger = new Logger(BarcodeService.name);
  constructor(
    private prisma: PrismaService,
    private configService: BarcodeConfigService,
  ) {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      throw new Error('BACKEND_URL environment variable is not set');
    }
    this.BARCODE_URL = `${backendUrl}/uploads/barcodes`;
  }
  async getRandom(data: GetRandomDto): Promise<Record<string, string>> {
    try {
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
        if (!DBC || (DBC !== 'M' && DBC !== 'F')) {
          throw new HttpException(
            'DBC is required for operation DAC,DAD,DCS',
            400,
          );
        }
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
          './helper/dl-generation.helper'
        );
        const num = await dlNumberGeneration(data.input);
        const result: Record<string, string> = {};
        for (const key of data.output) {
          result[fN[key]] = num;
        }
        return result;
      } else if (operation === 'DBD,DBA') {
        const DAJ: string = data.input.DAJ as string;
        const DBB: string = data.input.DBB as string;
        const DDB: string = data.input.DDB as string;
        const DDA: string = data.input.DDA as string;
        if (!DAJ || !DBB || !DDB || !DDA) {
          throw new HttpException(
            'DAJ, DBB, DDB, and DDA are required for operation DBD,DBA',
            400,
          );
        }
        const { dlIssueExpirationDates } = await import(
          './helper/dl-issue-expiration-dates.helper'
        );
        return await dlIssueExpirationDates(
          data.input as Record<string, string>,
        );
      } else if (operation === 'DCJ') {
        const { auditInfo } = await import('./helper/audit-info.helper');
        return await auditInfo(data.input as Record<string, string>);
      } else {
        throw new HttpException(`Unsupported operation: ${operation}`, 400);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error in getting random data',
        500,
      );
    }
  }
  async getCalculate(data: GetCalculateDto): Promise<Record<string, string>> {
    try {
      const operation = data.output.join(',');

      if (operation === 'DBA') {
        const { DBD } = data.input as Record<string, string>;
        if (!DBD) {
          throw new HttpException('DBD are required for DBA', 400);
        }

        const { dlExpirationDateCalculation } = await import(
          './helper/dl-expiration-date-calculation.helper'
        );
        return await dlExpirationDateCalculation(data.input);
      }

      if (operation === 'DCK') {
        const { DBD, DAQ, DBA, DBB } = data.input as Record<string, string>;
        if (
          !DBD ||
          typeof DBD !== 'string' ||
          !DAQ ||
          typeof DAQ !== 'string' ||
          !DBA ||
          typeof DBA !== 'string' ||
          !DBB ||
          typeof DBB !== 'string'
        ) {
          throw new HttpException(
            'DBD, DAQ, DBA, DBB are required for DCK and must be strings',
            400,
          );
        }

        const { getInventoryNumber } = await import(
          './helper/get-inventory-number.dto'
        );
        return await getInventoryNumber(data.input as Record<string, string>);
      }
      if (operation === 'DCF') {
        const { getDDNumber } = await import('./helper/get-dd-number.helper');
        return await getDDNumber(data.input as Record<string, string>);
      }

      throw new HttpException(`Unsupported operation: ${operation}`, 400);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException('Internal server error in calculate', 500);
    }
  }
  async generatePdf417(data: GeneratePDF417Dto): Promise<Barcode> {
    try {
      const config = await this.configService.findByStateAndRev(
        data.values.DAJ,
        data.values.DDB,
      );

      const values = Object.fromEntries(
        Object.entries(data.values)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)]),
      ) as Record<string, string>;

      const id = randomUUID();
      const [payload, settings] = config.generate(values);
      const execFileAsync = util.promisify(execFile);
      await execFileAsync(
        'python3',
        [
          `${path.join(process.cwd(), 'barcode.py')}`,
          payload
            .replaceAll('\n', '␊')
            .replaceAll('\r', '␍')
            .replaceAll('\x1e', '␞'),
          Object.entries(settings)
            .map(([k, v]) => `${k}=${v}`)
            .join('|'),
          id,
        ],
        {
          shell: false,
          windowsHide: true,
          maxBuffer: 10 * 1024 * 1024,
          cwd: process.cwd(),
        },
      );

      const barcode = await this.prisma.barcode.create({
        data: {
          id: id,
          url: `${this.BARCODE_URL}/${id}.png`,
          type: BarcodeType.PDF417,
          data: JSON.stringify(settings),
          userId: data.userId,
        },
      });

      return barcode;
    } catch (error) {
      this.logger.error('Error generating PDF417 barcode', error);
      throw new HttpException(
        'Internal server error in PDF417 generation',
        500,
      );
    }
  }
  async generateCode128(data: GenerateCode128Dto): Promise<Barcode> {
    try {
      const id = randomUUID();
      const execFileAsync = util.promisify(execFile);
      await execFileAsync(
        'python3',
        [`${path.join(process.cwd(), 'code-128.py')}`, data.value, id],
        {
          shell: false,
          windowsHide: true,
          maxBuffer: 10 * 1024 * 1024,
          cwd: process.cwd(),
        },
      );

      const barcode = await this.prisma.barcode.create({
        data: {
          id: id,
          url: `${this.BARCODE_URL}/${id}.png`,
          type: BarcodeType.CODE128,
          data: JSON.stringify({ inventory: data.value }),
          userId: data.userId,
        },
      });

      return barcode;
    } catch (error) {
      this.logger.error('Error generating CODE128 barcode', error);
      throw new HttpException(
        'Internal server error in CODE128 generation',
        500,
      );
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

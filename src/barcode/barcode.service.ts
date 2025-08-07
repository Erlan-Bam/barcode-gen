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
}

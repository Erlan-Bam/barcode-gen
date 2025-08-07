import { Controller, Post } from '@nestjs/common';
import { BarcodeService } from './barcode.service';
import {
  DLConfigFieldsToPresent,
  DLDownFields,
} from 'src/barcode-config/dto/configs.dto';
import { GetDataDto } from './dto/get-data.dto';

@Controller('barcodes')
export class BarcodeController {
  constructor(private barcodeService: BarcodeService) {}

  @Post('')
  async getFields(
    data: GetDataDto,
  ): Promise<DLConfigFieldsToPresent | DLDownFields> {
    return await this.barcodeService.getFields(data);
  }
}

import { Module } from '@nestjs/common';
import { BarcodeConfigService } from './barcode-config.service';

@Module({
  providers: [BarcodeConfigService],
  exports: [BarcodeConfigService],
})
export class BarcodeConfigModule {}

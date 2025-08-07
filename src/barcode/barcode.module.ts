import { Module } from '@nestjs/common';
import { BarcodeService } from './barcode.service';
import { BarcodeController } from './barcode.controller';
import { SharedModule } from 'src/shared/shared.module';
import { BarcodeConfigModule } from 'src/barcode-config/barcode-config.module';

@Module({
  imports: [SharedModule, BarcodeConfigModule],
  providers: [BarcodeService],
  controllers: [BarcodeController],
})
export class BarcodeModule {}

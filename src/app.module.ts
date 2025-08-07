import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { BarcodeConfigModule } from './barcode-config/barcode-config.module';
import { BarcodeModule } from './barcode/barcode.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    BarcodeConfigModule,
    BarcodeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

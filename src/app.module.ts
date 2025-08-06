import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { BarcodeConfigModule } from './barcode-config/barcode-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    BarcodeConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

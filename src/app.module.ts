import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { BarcodeConfigModule } from './barcode-config/barcode-config.module';
import { BarcodeModule } from './barcode/barcode.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100, // max 100 requests per 60 seconds
      },
    ]),

    SharedModule,
    BarcodeConfigModule,
    BarcodeModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

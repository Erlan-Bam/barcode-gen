import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { BarcodeConfigModule } from './barcode-config/barcode-config.module';
import { BarcodeModule } from './barcode/barcode.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100, // max 100 requests per 60 seconds
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SharedModule,
    BarcodeConfigModule,
    BarcodeModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

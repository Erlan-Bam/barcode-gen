import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { BarcodeConfigModule } from './barcode-config/barcode-config.module';
import { BarcodeModule } from './barcode/barcode.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100, // max 100 requests per 60 seconds
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      exclude: ['/api*'],
    }),
    SharedModule,
    BarcodeConfigModule,
    BarcodeModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { KafkaService } from './services/kafka.service';
import { BillingService } from './services/billing.service';

@Module({
  providers: [PrismaService, KafkaService, BillingService],
  exports: [PrismaService, KafkaService, BillingService],
})
export class SharedModule {}

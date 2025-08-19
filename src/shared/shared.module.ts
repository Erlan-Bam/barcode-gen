import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { KafkaService } from './services/kafka.service';
import { BillingService } from './services/billing.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [
    PrismaService,
    KafkaService,
    BillingService,
    JwtStrategy,
    JwtService,
  ],
  exports: [
    PrismaService,
    KafkaService,
    BillingService,
    JwtStrategy,
    JwtService,
  ],
})
export class SharedModule {}

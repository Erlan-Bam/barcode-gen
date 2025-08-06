import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';

@Module({ imports: [PrismaService], exports: [PrismaService] })
export class SharedModule {}

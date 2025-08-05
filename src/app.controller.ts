import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from './shared/services/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    // private readonly redis: RedisService,
    // private readonly kafka: KafkaService,
  ) {}

  @Get('/healthz')
  async liveness() {
    return {
      status: 'ok',
    };
  }

  @Get('/readyz')
  async readiness() {
    let db: 'ok' | 'error' = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (err) {
      db = 'error';
    }

    // 2) Redis check (if you have it)
    // let redis: 'ok' | 'error' = 'ok';
    // try {
    //   await this.redis.ping();
    // } catch {
    //   redis = 'error';
    // }

    // 3) Kafka check (if you have it)
    // let kafka: 'ok' | 'error' = 'ok';
    // try {
    //   await this.kafka.checkHealth();
    // } catch {
    //   kafka = 'error';
    // }

    const allOk = [db /*, redis, kafka*/].every((x) => x === 'ok');
    const status = allOk ? 'ready' : 'error';

    if (!allOk) {
      // return 503 so orchestrator knows we’re not ready
      throw new HttpException(
        {
          status,
          database: db,
          // redis,
          // kafka,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    return {
      status,
      database: db,
      // redis,
      // kafka,
    };
  }
}

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Kafka, Producer, logLevel } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka?: Kafka;
  private producer?: Producer;
  private connected = false;

  private readonly enabled = process.env.KAFKA_ENABLED === 'true';

  private clientId!: string;
  private brokers!: string[];

  async onModuleInit() {
    if (!this.enabled) {
      this.logger.warn(
        'Kafka is disabled by env (KAFKA_ENABLED=false). Skipping init.',
      );
      return;
    }

    const clientId = process.env.KAFKA_CLIENT_ID;
    if (!clientId) {
      throw new Error('Missing required environment variable: KAFKA_CLIENT_ID');
    }
    this.clientId = clientId;

    const brokers = process.env.KAFKA_BROKERS;
    if (!brokers) {
      throw new Error('Missing required environment variable: KAFKA_BROKERS');
    }
    this.brokers = brokers.split(',');

    this.kafka = new Kafka({
      clientId: this.clientId,
      brokers: this.brokers,
      logLevel: logLevel.INFO,
      retry: {
        retries: 2,
      },
    });

    this.producer = this.kafka.producer({ allowAutoTopicCreation: true });

    try {
      await this.producer.connect();
      this.connected = true;
      this.logger.log(
        `Kafka producer connected (clientId=${this.clientId}, brokers=${this.brokers.join(',')})`,
      );
    } catch (error) {
      this.connected = false;
      this.logger.error(`Failed to connect Kafka producer: ${error}`);
    }
  }

  async onModuleDestroy() {
    if (this.producer && this.connected) {
      try {
        await this.producer.disconnect();
        this.logger.log('Kafka producer disconnected');
      } catch (error) {
        this.logger.warn(`Error during Kafka producer disconnect: ${error}`);
      }
    }
  }

  async checkHealth() {
    if (!this.enabled) {
      throw new Error('Kafka is disabled by env (KAFKA_ENABLED=false)');
    }
    if (!this.connected) {
      throw new Error('Kafka producer is not connected');
    }
    return 'Kafka is healthy';
  }

  async publishBarcode() {}
}

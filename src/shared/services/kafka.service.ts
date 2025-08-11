import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Barcode } from '@prisma/client';
import { Kafka, Producer, logLevel } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private readonly enabled = process.env.KAFKA_ENABLED === 'true';
  private readonly topics = {
    generated: 'barcode.new',
    edited: 'barcode.edit',
  } as const;

  private kafka?: Kafka;
  private producer?: Producer;
  private connected = false;
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

  private ensureReady() {
    if (!this.enabled) {
      throw new Error('Kafka is disabled by env (KAFKA_ENABLED=false)');
    }
    if (!this.connected || !this.producer) {
      throw new Error('Kafka producer is not connected');
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

  async sendBarcodeGenerated(barcode: Barcode) {
    this.ensureReady();

    try {
      const value = JSON.stringify(barcode);
      await this.producer!.send({
        topic: this.topics.generated,
        messages: [
          {
            key: barcode.id,
            value,
            headers: {
              'content-type': 'application/json',
              'x-event-type': this.topics.generated,
              'x-client-id': this.clientId,
              'x-timestamp': new Date().toISOString(),
            },
          },
        ],
      });
    } catch (error) {
      this.logger.error('Error sending barcode generated message:', error);
      throw error;
    }
  }

  async sendBarcodeEdited(barcode: Barcode) {
    this.ensureReady();

    try {
      const value = JSON.stringify(barcode);
      await this.producer!.send({
        topic: this.topics.edited,
        messages: [
          {
            key: barcode.id,
            value,
            headers: {
              'content-type': 'application/json',
              'x-event-type': this.topics.edited,
              'x-client-id': this.clientId,
              'x-timestamp': new Date().toISOString(),
            },
          },
        ],
      });
    } catch (error) {
      this.logger.error('Error sending barcode generated message:', error);
      throw error;
    }
  }
}

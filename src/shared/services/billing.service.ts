import { Injectable, HttpException, Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private billing: AxiosInstance;
  constructor() {
    const BILLING_URL = process.env.BILLING_URL;
    if (!BILLING_URL) {
      throw new Error('BILLING_URL is not set in .env');
    }
    this.billing = axios.create({ baseURL: BILLING_URL });
  }

  async canBuy(token: string) {
    try {
      const response = await this.billing.get('/check/credits', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.credits > 0;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.debug(`Error occured in can buy barcode: ${error}`);
        throw new HttpException(error.message, error.response?.status ?? 500);
      } else {
        this.logger.error(
          `Unexpected error occured in can buy barcode: ${error}`,
        );
        throw new HttpException('Something went wrong', 500);
      }
    }
  }
}

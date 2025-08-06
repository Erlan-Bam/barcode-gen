import { Test, TestingModule } from '@nestjs/testing';
import { BarcodeConfigService } from './barcode-config.service';

describe('BarcodeConfigService', () => {
  let service: BarcodeConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BarcodeConfigService],
    }).compile();

    service = module.get<BarcodeConfigService>(BarcodeConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

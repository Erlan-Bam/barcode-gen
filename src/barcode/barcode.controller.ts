// src/barcode/barcode.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { BarcodeService } from './barcode.service';
import {
  DLConfigFieldsToPresent,
  DLDownFields,
} from 'src/barcode-config/dto/configs.dto';
import { GetDataDto } from './dto/get-data.dto';
import { BarcodeConfigService } from 'src/barcode-config/barcode-config.service';
import { GetRandomDto } from './dto/get-random.dto';

@ApiTags('barcodes')
@Controller('barcodes')
export class BarcodeController {
  constructor(
    private barcodeService: BarcodeService,
    private configService: BarcodeConfigService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Get barcode configuration fields',
    description:
      'Первая позиция страна, вторая позиция штат, третья позиция ревизия, четвёртая позиция тип документа, пятая позиция - получать только часть полей характерных для типа документа, если false то все поля документа. Не один из параметров не является обязательным, можно отправлять пустой массив значений. При необходимости указания последующих параметров, нужно указазывать предыдущие',
  })
  @ApiBody({
    type: GetDataDto,
    description: 'Data parameters for barcode fields',
  })
  async getFields(
    @Body() data: GetDataDto,
  ): Promise<DLConfigFieldsToPresent | DLDownFields> {
    return await this.configService.getFields(data);
  }

  @Post('random')
  async getRandom(data: GetRandomDto) {
    return this.barcodeService.getRandom(data);
  }
}

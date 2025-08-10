// src/barcode/barcode.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { BarcodeService } from './barcode.service';
import {
  DLConfigFieldsToPresent,
  DLDownFields,
} from 'src/barcode-config/dto/configs.dto';
import { GetDataDto } from './dto/get-data.dto';
import { BarcodeConfigService } from 'src/barcode-config/barcode-config.service';
import { GetRandomDto } from './dto/get-random.dto';
import { GetCalculateDto } from './dto/get-calculate.dto';
import { GeneratePDF417Dto } from './dto/generate-pdf417.dto';

@ApiTags('barcodes')
@Controller('barcodes')
// @ApiBearerAuth('JWT')
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
  @ApiOperation({
    summary:
      'Если у поля на странице есть random и randomHandler, то можно обращаться к этому url. Для составления объекта запроса, нужно взять все элементы из ключа randomHandler, получить их значения со страницы и положить в объект req запроса, где ключи это аббревиатуры полей, а значения - значения полей. В массив res нужно положить элементы из значения randomHandler.',
    description:
      'Принимает { input, output }. output должен быть одним из поддерживаемых наборов: ' +
      '["DAG","DAI","DAK"] | ["DAC","DAD","DCS"] | ["DBB"] | ["DAQ"] | ["DBD","DBA"] | ["DCJ"]. ' +
      'Возвращает объект с человекочитаемыми ключами (по fN) и строковыми значениями.',
  })
  @ApiBody({
    description:
      'Input params (state, gender, etc.) and which dataset to generate',
    type: GetRandomDto,
  })
  async getRandom(@Body() data: GetRandomDto) {
    return this.barcodeService.getRandom(data);
  }

  @Post('calculate')
  @ApiOperation({
    summary:
      'Если у поля на странице есть calculate и calculateHandler, то можно обращаться к этому url. Для составления объекта запроса, нужно взять все элементы из ключа calculateHandler, получить их значения со страницы и положить в объект input запроса, где ключи это аббревиатуры полей, а значения - значения полей. В массив res нужно положить элементы из значения calculateHandler.',
    description:
      'Принимает { input, output }. Поддерживаемые операции: ' +
      '["DBA"] (expiration date), ["DCK"] (inventory number), ["DCF"] (DD number).',
  })
  @ApiBody({
    type: GetCalculateDto,
    description: 'Input data and expected output to calculate',
  })
  async getCalculate(@Body() data: GetCalculateDto) {
    return this.barcodeService.getCalculate(data);
  }

  @Post('pdf417')
  async generatePdf417(@Body() data: GeneratePDF417Dto) {
    return this.barcodeService.generatePdf417(data);
  }
}

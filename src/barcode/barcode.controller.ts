// src/barcode/barcode.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  ParseUUIDPipe,
  Headers,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
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
import { GenerateCode128Dto } from './dto/generate-code128.dto';
import { AuthGuard } from '@nestjs/passport';
import { EditBarcodeDto } from './dto/edit-barcode.dto';
import { KafkaService } from 'src/shared/services/kafka.service';
import { User } from 'src/shared/decorator/user.decorator';

@ApiTags('barcodes')
@Controller('barcodes')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'))
export class BarcodeController {
  private readonly logger = new Logger(BarcodeController.name);
  constructor(
    private barcodeService: BarcodeService,
    private kafkaService: KafkaService,
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
  @ApiOperation({
    summary: 'Сгенерировать PDF417 (PNG сохраняются в /uploads/barcodes)',
  })
  @ApiBody({
    type: GeneratePDF417Dto,
    examples: {
      basic: {
        value: {
          values: {
            DAJ: 'AR',
            DDB: '03012018',
            DCS: 'AVERBACH',
            DAC: 'JUNIOR',
            DAD: 'MAURICE',
            DBB: '07191994',
            DBD: '04162023',
            DBA: '08182031',
            DBC: 1,
            DAG: '49 ROLLINGBROOK',
            DAI: 'GREENBRIAR',
            DAK: '72958',
            DAQ: '973101496',
            DCF: '7279004467 0601',
            DAU: '012',
            DAY: 'BRO',
            DDL: 1,
            DDK: 1,
            QQQ: 'DL',
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Неверные данные (валидация DTO)',
  })
  async generatePdf417(
    @Body() data: GeneratePDF417Dto,
    @User('id') userId: string,
    @Headers('Authorization') auth: string,
  ) {
    data.userId = userId;
    data.token = auth?.split(' ')[1];
    const barcode = await this.barcodeService.generatePdf417(data);
    try {
      await this.kafkaService.sendBarcodeGenerated(barcode);
    } catch (error) {
      this.logger.error('Kafka error in /api/barcodes/pdf417:', error);
    }
    return barcode;
  }

  @Post('code128')
  @ApiOperation({
    summary: 'Сгенерировать Code 128 (PNG сохраняется в /uploads/barcodes)',
  })
  @ApiBody({
    type: GenerateCode128Dto,
    examples: {
      basic: {
        value: { value: 'INV-000123' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Неверные данные (валидация DTO)' })
  async generateCode128(
    @Body() data: GenerateCode128Dto,
    @User('id') userId: string,
    @Headers('Authorization') auth: string,
  ) {
    data.userId = userId;
    data.token = auth?.split(' ')[1];
    const barcode = await this.barcodeService.generateCode128(data);

    try {
      await this.kafkaService.sendBarcodeGenerated(barcode);
    } catch (error) {
      this.logger.error('Kafka error in /api/barcodes/code128:', error);
    }
    return barcode;
  }

  @Patch(':id/edit')
  async editBarcode(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: EditBarcodeDto,
    @User('id') userId: string,
  ) {
    data.userId = userId;
    const barcode = await this.barcodeService.editBarcode(id, data);
    try {
      await this.kafkaService.sendBarcodeEdited(barcode);
    } catch (error) {
      this.logger.error('Kafka error in /api/barcodes/:id/edit:', error);
    }
    return barcode;
  }
}

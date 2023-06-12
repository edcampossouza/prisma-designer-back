import { Body, Controller, Get, Post } from '@nestjs/common';
import { SerializedSchema } from './SchemaValidator';
import { SchemaService } from './schema.service';

@Controller('schema')
export class SchemaController {
  constructor(private schemaService: SchemaService) {}
  @Get()
  schema() {
    return { message: 'Hello Schema' };
  }

  @Post('generate')
  format(@Body() body: SerializedSchema) {
    return this.schemaService.fileFromSerializedSchema(body);
  }
}

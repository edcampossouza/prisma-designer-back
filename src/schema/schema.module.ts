import { Module } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { SchemaController } from './schema.controller';

@Module({
  providers: [SchemaService],
  controllers: [SchemaController]
})
export class SchemaModule {}

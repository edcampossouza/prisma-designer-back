import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SerializedSchema } from './SchemaValidator';
import { SchemaService } from './schema.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from '@prisma/client';

@Controller('schema')
export class SchemaController {
  constructor(private schemaService: SchemaService) {}
  @Get('hello')
  schema() {
    return { message: 'Hello Schema' };
  }

  @Post('generate')
  format(@Body() body: SerializedSchema) {
    return this.schemaService.fileFromSerializedSchema(body);
  }

  @Get('')
  @UseGuards(AuthGuard)
  async schemas(@Request() req) {
    const user: User = req.user;
    return await this.schemaService.getSchemasFromUser(user.id);
  }

  @Post('')
  @UseGuards(AuthGuard)
  async postSchema(@Request() req, @Body() schema: SerializedSchema) {
    const user: User = req.user;
    await this.schemaService.saveSchema(user.id, schema);
  }
}

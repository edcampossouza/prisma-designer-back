import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Delete,
} from '@nestjs/common';
import { SerializedSchema } from './SchemaValidator';
import { SchemaService } from './schema.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '@prisma/client';

@Controller('schema')
export class SchemaController {
  constructor(private schemaService: SchemaService) {}

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

  @Get(':name')
  @UseGuards(AuthGuard)
  async schema(@Request() req, @Param('name') name: string) {
    const user: User = req.user;
    return await this.schemaService.getSchemaByName(user.id, name);
  }
  @Delete(':name')
  @UseGuards(AuthGuard)
  async deleteSchema(@Request() req, @Param('name') name: string) {
    const user: User = req.user;
    await this.schemaService.deleteSchema(user.id, name);
  }

  @Post('')
  @UseGuards(AuthGuard)
  async postSchema(@Request() req, @Body() schema: SerializedSchema) {
    const user: User = req.user;
    await this.schemaService.saveSchema(user.id, schema);
  }
}

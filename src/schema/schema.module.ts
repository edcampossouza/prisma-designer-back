import { Module } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { SchemaController } from './schema.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [SchemaService, PrismaService, AuthModule],
  controllers: [SchemaController],
})
export class SchemaModule {}

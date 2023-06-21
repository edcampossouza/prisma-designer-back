import { Injectable } from '@nestjs/common';
import { SerializedSchema } from './SchemaValidator';
import { PrismaService } from 'src/prisma/prisma.service';
import { format } from 'prettier';
import * as ppp from 'prettier-plugin-prisma';

@Injectable()
export class SchemaService {
  constructor(private prismaService: PrismaService) {}
  fileFromSerializedSchema(schema: SerializedSchema): string {
    console.log(JSON.stringify(schema, null, 2));
    let file = '';
    schema.models.forEach((model) => {
      file += ` model ${model.name} { \n`;
      model.fields.forEach((field) => {
        file += `      ${field.name}  ${field.type}`;
        field.attributes.forEach((attr) => {
          if (attr.name !== 'default') {
            file += ` @${attr.name}`;
          } else {
            file += ` @default (${field.default})`;
          }
        });
        file += '\n';
        if (field.references) {
          file += ` ${field.references.model.toLowerCase()} ${
            field.references.model
          } @relation (fields: [${field.name}], references: [${
            field.references.field
          }])\n`;
        }
      });
      file += '} \n';
    });

    const formatted = format(file, { parser: 'prisma-parse', plugins: [ppp] });
    return formatted;
  }

  async getSchemasFromUser(userId: number) {
    return await this.prismaService.dataSchema.findMany({ where: { userId } });
  }
}

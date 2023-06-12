import { Injectable } from '@nestjs/common';
import { SerializedSchema } from './SchemaValidator';
import { format } from 'prettier';
import * as ppp from 'prettier-plugin-prisma';

@Injectable()
export class SchemaService {
  fileFromSerializedSchema(schema: SerializedSchema): string {
    console.log(JSON.stringify(schema, null, 2));
    console.log(JSON.stringify(ppp));
    let file = '';
    schema.models.forEach((model) => {
      file += ` model ${model.name} { \n`;
      model.fields.forEach((field) => {
        file += `      ${field.name}  ${field.type}\n`;
        if (field.reference) {
          file += ` ${field.reference.model.toLowerCase()} ${
            field.reference.model
          } @relation (fields: [${field.name}], references: [${
            field.reference.field
          }])
          
          \n`;
        }
      });
      file += '} \n';
    });

    const formatted = format(file, { parser: 'prisma-parse' });
    return formatted;
  }
}
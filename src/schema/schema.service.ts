import { ConflictException, Injectable } from '@nestjs/common';
import { SerializedSchema } from './SchemaValidator';
import { PrismaService } from 'src/prisma/prisma.service';
import { format } from 'prettier';
import * as ppp from 'prettier-plugin-prisma';
import { Prisma, DataType } from '@prisma/client';

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

  async saveSchema(userId: number, schema: SerializedSchema) {
    console.log(schema);
    try {
      //persist schema
      const createdSchema = await this.prismaService.dataSchema.create({
        data: {
          name: schema.name,
          userId,
        },
      });
      //persist models and fields
      await Promise.all(
        schema.models.map((model) => {
          return this.prismaService.dataModel.create({
            data: {
              schemaId: createdSchema.id,
              name: model.name,
              DataField: {
                createMany: {
                  data: model.fields.map((field) => ({
                    name: field.name,
                    type: DataType[field.type],
                  })),
                },
              },
            },
          });
        }),
      );
      //persist relations
      for (const orTable of schema.models) {
        for (const orField of orTable.fields) {
          if (orField.references) {
            const originField =
              await this.prismaService.dataField.findFirstOrThrow({
                where: {
                  name: orField.name,
                  model: {
                    name: orTable.name,
                    schemaId: createdSchema.id,
                  },
                },
              });
            const targetField =
              await this.prismaService.dataField.findFirstOrThrow({
                where: {
                  name: orField.references.field,
                  model: {
                    name: orField.references.model,
                    schemaId: createdSchema.id,
                  },
                },
              });
            await this.prismaService.keyRelation.create({
              data: {
                fieldFrom: originField.id,
                fieldTo: targetField.id,
              },
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        console.log('???');
        throw new ConflictException(`Schema "${schema.name}" already exists`);
      } else throw error;
    }
  }
}

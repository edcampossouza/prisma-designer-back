import { NotFoundException } from '@nestjs/common';
import { SerializedSchema } from 'prismadesign-lib';
import { PrismaService } from 'src/prisma/prisma.service';

export async function buildSchemaFromDB(
  userId: number,
  schemaName: string,
  prisma: PrismaService,
): Promise<SerializedSchema> {
  try {
    const dataSchema = await prisma.dataSchema.findUniqueOrThrow({
      where: { userId_name: { userId, name: schemaName } },
    });

    const dataModels = await prisma.dataModel.findMany({
      where: { schemaId: dataSchema.id },
      include: {
        DataField: {
          include: {
            KeyRelationFrom: {
              include: {
                FieldTo: {
                  include: {
                    model: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const models = dataModels.map((m) => ({
      name: m.name,
      fields: m.DataField.map((f) => ({
        name: f.name,
        type: f.type,
        default: f.default || undefined,
        attributes: f.attributes.map((a) => ({ name: a })),
        references:
          f.KeyRelationFrom.length > 0
            ? {
                model: f.KeyRelationFrom[0].FieldTo.model.name,
                field: f.KeyRelationFrom[0].FieldTo.name,
              }
            : undefined,
      })),
    }));

    return {
      name: schemaName,
      models,
    };
  } catch (error) {
    console.log(error);
    throw new NotFoundException();
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { SchemaService } from './schema.service';
import { PrismaService } from '../prisma/prisma.service';

const serializedTest = {
  name: 'blog',
  models: [
    {
      name: 'User',
      fields: [
        {
          name: 'id',
          type: 'Int',
          attributes: [{ name: 'id' }],
        },
      ],
    },
    {
      name: 'Post',
      fields: [
        {
          name: 'userId',
          type: 'Int',
          attributes: [],
          references: {
            model: 'User',
            field: 'id',
          },
        },
      ],
    },
  ],
};
const schemaResult = `model User {
  id   Int    @id
  Post Post[]
}

model Post {
  userId Int
  user   User @relation(fields: [userId], references: [id])
}
`;

describe('SchemaService', () => {
  let service: SchemaService;
  const prismaMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchemaService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<SchemaService>(SchemaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create file', async () => {
    const result = service.fileFromSerializedSchema(serializedTest);
    expect(result).toBe(schemaResult);
  });
});

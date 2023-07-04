import { Test, TestingModule } from '@nestjs/testing';
import { SchemaService } from './schema.service';
import { PrismaService } from '../prisma/prisma.service';
import { schemaResult, serializedTest } from './test-data';

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

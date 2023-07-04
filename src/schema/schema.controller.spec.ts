import { Test, TestingModule } from '@nestjs/testing';
import { SchemaController } from './schema.controller';
import { SchemaService } from './schema.service';
import { JwtService } from '@nestjs/jwt';
import { schemaResult, serializedTest } from './test-data';

describe('SchemaController', () => {
  let controller: SchemaController;
  const schemaServiceMock = {
    fileFromSerializedSchema: () => schemaResult,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchemaController],
      providers: [
        JwtService,
        { provide: SchemaService, useValue: schemaServiceMock },
      ],
    }).compile();

    controller = module.get<SchemaController>(SchemaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should generate the schema', () => {
    const result = controller.format(serializedTest);
    expect(result).toBe(schemaResult);
  });
});

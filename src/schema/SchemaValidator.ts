import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Reference {
  @IsString()
  model: string;

  @IsString()
  field: string;
}

class Attribute {
  @IsString()
  name: string;
}

class Field {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => Attribute)
  @IsArray()
  attributes: Attribute[];

  @ValidateNested()
  @Type(() => Reference)
  reference?: Reference;
}

class Model {
  @IsString()
  name: string;

  @ValidateNested()
  @IsArray()
  @Type(() => Field)
  fields: Field[];
}

class Schema {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => Model)
  models: Model[];
}

export { Schema as SerializedSchema };

import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
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

  default?: string;

  @ValidateNested()
  @Type(() => Attribute)
  @IsArray()
  attributes: Attribute[];

  @ValidateNested()
  @Type(() => Reference)
  references?: Reference;
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

  @ValidateNested()
  @IsArray()
  @IsOptional()
  @Type(() => Coordinate)
  coordinates?: Coordinate[];
}

class Coordinate {
  @IsString()
  name: string;
  @IsNumber()
  x: number;
  @IsNumber()
  y: number;
}

export { Schema as SerializedSchema };

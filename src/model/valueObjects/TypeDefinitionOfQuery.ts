import Joi from 'joi';
import SchematicJoiModel from 'schematic-joi-model';

import { TypeDefinitionOfQuerySelectExpression } from './TypeDefinitionOfQuerySelectExpression';
import { TypeDefinitionOfQueryTableReference } from './TypeDefinitionOfQueryTableReference';
import { TypeDefinitionOfQueryInputVariable } from './TypeDefinitionOfQueryInputVariable';

const schema = Joi.object().keys({
  name: Joi.string().required(),
  path: Joi.string().required(), // path to the sql that the typedef was based on
  selectExpressions: Joi.array()
    .items(TypeDefinitionOfQuerySelectExpression.schema)
    .required(),
  tableReferences: Joi.array()
    .items(TypeDefinitionOfQueryTableReference.schema)
    .required(),
  inputVariables: Joi.array()
    .items(TypeDefinitionOfQueryInputVariable.schema)
    .required(),
});
export interface TypeDefinitionOfQuery {
  name: string;
  path: string;
  selectExpressions: TypeDefinitionOfQuerySelectExpression[];
  tableReferences: TypeDefinitionOfQueryTableReference[];
  inputVariables: TypeDefinitionOfQueryInputVariable[];
}
export class TypeDefinitionOfQuery extends SchematicJoiModel<TypeDefinitionOfQuery> implements TypeDefinitionOfQuery {
  public static schema = schema;
}

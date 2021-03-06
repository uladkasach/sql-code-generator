import { TypeDefinition } from '../../../model';
import { TypeDefinitionOfQuery } from '../../../model/valueObjects/TypeDefinitionOfQuery';
import { castQueryNameToTypescriptTypeName } from '../common/castQueryNameToTypescriptTypeName';
import { defineTypescriptTypeFromReference } from '../common/defineTypescriptTypeFromReference/defineTypescriptTypeFromReference';
import { defineTypescriptTypeFromDataTypeArrayOrReference } from '../common/defineTypescriptTypeFromDataTypeArrayOrReference';

export const defineTypescriptTypesForQuery = ({
  definition,
  allDefinitions,
}: {
  definition: TypeDefinitionOfQuery;
  allDefinitions: TypeDefinition[];
}) => {
  // define the typescript type name for the query
  const typescriptTypeName = castQueryNameToTypescriptTypeName({ name: definition.name });

  // define the input interface
  const typescriptInputInterfacePropertyDefinitions = definition.inputVariables.map((inputVariable) => {
    const typescriptTypeForReference = defineTypescriptTypeFromDataTypeArrayOrReference({
      type: inputVariable.type,
      queryTableReferences: definition.tableReferences,
      typeDefinitions: allDefinitions,
    });
    return `${inputVariable.name}: ${typescriptTypeForReference};`;
  });
  const typescriptInputInterfaceDefinition = typescriptInputInterfacePropertyDefinitions.length // if no inputs, then interface; else, type = null
    ? `
export interface ${typescriptTypeName}Input {
  ${typescriptInputInterfacePropertyDefinitions.join('\n  ')}
}
  `.trim()
    : `
export type ${typescriptTypeName}Input = null;
`.trim();

  // define the output interface
  const typescriptOutputInterfacePropertyDefinitions = definition.selectExpressions.map((selectExpression) => {
    const typescriptTypeForReference = defineTypescriptTypeFromReference({
      reference: selectExpression.typeReference,
      queryTableReferences: definition.tableReferences,
      typeDefinitions: allDefinitions,
    });
    return `${selectExpression.alias}: ${typescriptTypeForReference};`;
  });
  const typescriptOutputInterfaceDefinition = `
export interface ${typescriptTypeName}Output {
  ${typescriptOutputInterfacePropertyDefinitions.join('\n  ')}
}
  `.trim();

  // return typescript types
  return `
${typescriptInputInterfaceDefinition}
${typescriptOutputInterfaceDefinition}
  `.trim();
};

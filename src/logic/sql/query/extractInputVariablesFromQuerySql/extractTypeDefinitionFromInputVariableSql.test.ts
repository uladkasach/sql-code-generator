import { TypeDefinitionOfQueryInputVariable } from '../../../../model/valueObjects/TypeDefinitionOfQueryInputVariable';
import { extractTypeDefinitionFromInputVariableSql } from './extractTypeDefinitionFromInputVariableSql';

describe('extractTypeDefinitionFromInputVariableSql', () => {
  const examples = [
    {
      token: ':id',
      sql: `
select i.url
from image i
where i.id = :id;
      `.trim(),
      def: new TypeDefinitionOfQueryInputVariable({
        name: 'id',
        tableReferencePath: 'i.id',
        functionReferencePath: null,
      }),
    },
    {
      token: ':id',
      sql: `
select i.url
from image i
where i.id=:id;
      `.trim(),
      def: new TypeDefinitionOfQueryInputVariable({
        name: 'id',
        tableReferencePath: 'i.id',
        functionReferencePath: null,
      }),
    },
    {
      token: ':id',
      sql: `
select i.url
from image i
where :id = i.id;
      `.trim(),
      def: new TypeDefinitionOfQueryInputVariable({
        name: 'id',
        tableReferencePath: 'i.id',
        functionReferencePath: null,
      }),
    },
    {
      token: ':id',
      sql: `
select i.url
from image i
where :id=i.id;
      `.trim(),
      def: new TypeDefinitionOfQueryInputVariable({
        name: 'id',
        tableReferencePath: 'i.id',
        functionReferencePath: null,
      }),
    },
    {
      token: ':externalId',
      sql: `
select idea.title, idea.description
from idea
where 1=1
  and idea.external_id = :externalId
  and idea.data_source = :dataSource;
      `.trim(),
      def: new TypeDefinitionOfQueryInputVariable({
        name: 'externalId',
        tableReferencePath: 'idea.external_id',
        functionReferencePath: null,
      }),
    },
    {
      token: ':name',
      sql: `
SELECT
  suggestion.id,
  suggestion.uuid,
  suggestion.suggested_idea_id
FROM suggestions s
WHERE 1=1
  AND s.suggestion_source_id = get_id_from_suggestion_source_name(:name)
  AND s.created_at > '2020-01-01 05:55:55';
      `.trim(),
      def: new TypeDefinitionOfQueryInputVariable({
        name: 'name',
        tableReferencePath: null,
        functionReferencePath: 'get_id_from_suggestion_source_name.0', // second arg of function
      }),
    },
    // TODO: support functions in functions; https://github.com/uladkasach/sql-code-generator/issues/4
  ];
  examples.forEach((example) => {
    const exampleSqlFlattened = example.sql.replace(/\s+/g, ' ');
    it(`should be able to determine types accurately for this example: "${example.token}" in "${exampleSqlFlattened}"`, () => {
      const def = extractTypeDefinitionFromInputVariableSql({ token: example.token, sql: example.sql });
      expect(def).toEqual(example.def);
    });
  });
});
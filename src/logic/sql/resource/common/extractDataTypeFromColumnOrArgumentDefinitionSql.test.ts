import { DataType } from '../../../../model';
import { extractDataTypeFromColumnOrArgumentDefinitionSql } from './extractDataTypeFromColumnOrArgumentDefinitionSql';

describe('extractDataTypeFromColumnOrArgumentDefinitionSql', () => {
  const examples = [
    {
      sql: '`id` bigint(20) NOT NULL AUTO_INCREMENT',
      type: DataType.NUMBER,
    },
    {
      sql: 'price DECIMAL(5,2) DEFAULT NULL',
      type: DataType.NUMBER,
    },
    {
      sql: 'uuid char(36) COLLATE utf8mb4_bin NOT NULL',
      type: DataType.STRING,
    },
    {
      sql: '`created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
      type: DataType.DATE,
    },
    {
      sql: 'credit VARCHAR(190) COLLATE utf8mb4_bin',
      type: DataType.STRING,
    },
    {
      sql: 'in_url varchar(190)',
      type: DataType.STRING,
    },
  ];
  examples.forEach((example) => {
    it(`should be able to determine type accurately for this example: "${example.sql}"`, () => {
      const type = extractDataTypeFromColumnOrArgumentDefinitionSql({ sql: example.sql });
      expect(type).toEqual(example.type);
    });
  });
});
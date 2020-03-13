import { extractSelectExpressionsFromQuerySql } from './extractSelectExpressionsFromQuerySql';
import { getSqlFromFile } from '../../../config/_utils/getSqlFromFile';

describe('extractSelectExpressionsFromQuerySql', () => {
  it('should be able to determine types accurately for this example', async () => {
    const sql = await getSqlFromFile({
      filePath: `${__dirname}/../../../__test_assets__/queries/find_image_by_id.sql`,
    });
    const defs = extractSelectExpressionsFromQuerySql({ sql });
    expect(defs).toMatchSnapshot();
  });
  it('should be able to determine types accurately for this other example', async () => {
    const sql = await getSqlFromFile({
      filePath: `${__dirname}/../../../__test_assets__/queries/select_suggestion.sql`,
    });
    const defs = extractSelectExpressionsFromQuerySql({ sql });
    expect(defs.slice(-1)[0].alias).toEqual('updated_at');
    expect(defs.slice(-1)[0].typeReference.tableReferencePath).toEqual('v.created_at');
    expect(defs).toMatchSnapshot();
  });
  it('should be able to determine types accurately for query selecting function output', async () => {
    const sql = await getSqlFromFile({
      filePath: `${__dirname}/../../../__test_assets__/queries/upsert_suggestion.sql`,
    });
    const defs = extractSelectExpressionsFromQuerySql({ sql });
    expect(defs[0].alias).toEqual('id');
    expect(defs[0].typeReference.functionReferencePath).toEqual('upsert_suggestion.output');
    expect(defs).toMatchSnapshot();
  });
  it('should be able to determine types accurately for query selecting function output and normal table columns', async () => {
    const sql = await getSqlFromFile({
      filePath: `${__dirname}/../../../__test_assets__/queries/find_users_by_last_name.sql`,
    });
    const defs = extractSelectExpressionsFromQuerySql({ sql });
    expect(defs[1].alias).toEqual('full_name');
    expect(defs[1].typeReference.functionReferencePath).toEqual('concat.output');
    expect(defs).toMatchSnapshot();
  });
});
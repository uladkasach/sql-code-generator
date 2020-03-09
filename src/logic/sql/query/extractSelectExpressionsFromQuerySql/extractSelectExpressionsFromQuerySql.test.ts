import { extractSelectExpressionsFromQuerySql } from './extractSelectExpressionsFromQuerySql';
import { getSqlFromFile } from '../../../config/_utils/getSqlFromFile';

describe('extractSelectExpressionsFromQuerySql', () => {
  it('should be able to determine types accurately for this example', async () => {
    const sql = await getSqlFromFile({ filePath: `${__dirname}/../__test_assets__/find_image_by_id.sql` });
    const defs = extractSelectExpressionsFromQuerySql({ sql });
    expect(defs).toMatchSnapshot();
  });
  it('should be able to determine types accurately for this other example', async () => {
    const sql = await getSqlFromFile({ filePath: `${__dirname}/../__test_assets__/select_suggestion.sql` });
    const defs = extractSelectExpressionsFromQuerySql({ sql });
    expect(defs.slice(-1)[0].alias).toEqual('updated_at');
    expect(defs.slice(-1)[0].sourcePath).toEqual('v.created_at');
    expect(defs).toMatchSnapshot();
  });
});
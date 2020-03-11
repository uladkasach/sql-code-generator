import { QueryDeclaration } from './QueryDeclaration';
import { ResourceDeclaration, ResourceType } from './ResourceDeclaration';
import { GeneratorConfig } from './GeneratorConfig';
import { DatabaseLanguage } from '../constants';

describe('GeneratorConfig', () => {
  const queryDec = new QueryDeclaration({
    name: '__NAME__',
    path: '__FILE_PATH__',
    sql: '__SQL__',
  });
  const resourceDec = new ResourceDeclaration({
    type: ResourceType.FUNCTION,
    name: '__NAME__',
    path: '__FILE_PATH__',
    sql: '__SQL__',
  });
  it('should initialize for valid inputs', () => {
    const config = new GeneratorConfig({
      dir: '__DIR__',
      language: DatabaseLanguage.MYSQL,
      dialect: '5.7',
      declarations: [queryDec, resourceDec],
    });
    expect(config).toMatchObject({
      language: DatabaseLanguage.MYSQL,
      dialect: '5.7',
      declarations: [queryDec, resourceDec],
    });
  });
  it('should throw error on invalid input', () => {
    try {
      new GeneratorConfig({
        languagzzze: 'mysql',
        dialect: '5.7',
        definitions: [queryDec],
      } as any); // tslint:disable-line no-unused-expression
    } catch (error) {
      expect(error.constructor.name).toEqual('ValidationError');
    }
  });
});

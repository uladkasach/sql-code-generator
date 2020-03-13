sql-code-generator
==============

Generate code from your SQL schema and queries for type safety and development speed.

Generates type definitions and query functions with a single command!

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/sql-code-generator.svg)](https://npmjs.org/package/sql-code-generator)
[![Codecov](https://codecov.io/gh/uladkasach/sql-code-generator/branch/master/graph/badge.svg)](https://codecov.io/gh/uladkasach/sql-code-generator)
[![Downloads/week](https://img.shields.io/npm/dw/sql-code-generator.svg)](https://npmjs.org/package/sql-code-generator)
[![License](https://img.shields.io/npm/l/sql-code-generator.svg)](https://github.com/uladkasach/sql-code-generator/blob/master/package.json)

# Table of Contents
<!-- toc -->
- [Goals](#goals)
- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
  - [`schema-control generate`](#schema-control-generate)
  - [`schema-control help [COMMAND]`](#schema-control-help-command)
- [Contribution](#contribution)
<!-- tocstop -->

# Goals

The goal of `sql-code-generator` is to use the SQL you've already defined in order to speed up development and eliminate errors. This is done by extracting type definitions from sql and exposing those type definitions in code, automatically generating the interface that bridges your sql and your primary development language.

This includes:
- generating type definitions from SQL resources (e.g., tables, views, functions, procedures)
- generating type definitions from SQL queries (e.g., `select * from table`)
- generating typed functions that execute SQL queries from SQL queries (e.g., `const sqlQueryFindAllUsersByName = async ({ input: InputType }): Promise<OutputType>`)

This enables:
- controlling and mastering database logic fully in SQL
- strictly bound types between sql and typescript for compile time error checking
- strongly typed, auto-generated database query functions for speed, consistency, and encoding of best practices
- autocompletion and explore-ability of sql resources in your IDE

Inspired by [graphql-code-generator](https://graphql-code-generator.com/)

# Installation

## 1. Save the package as a dev dependency
  ```sh
  npm install --save-dev sql-code-generator
  ```

## 2. Define a config yml

This file will define the sql language to extract type definitions from, where your sql resources and sql queries are, and where to output the generated types and query functions. By default, the generator looks for a file named `codegen.sql.yml` in your projects root.

For example:
```yml
language: mysql
dialect: 5.7
resources: # where to find your tables, functions, views, procedures
  - "schema/**/*.sql"
queries: # where to find your queries (each file must `export const query = `...`);
  - "src/dao/**/*.ts"
  - "!src/**/*.test.ts"
  - "!src/**/*.test.integration.ts"
generates: # where to output the generated code
  types: src/dao/generated/types.ts
  queryFunctions: src/dao/generated/queryFunctions.ts
```

## 3. Test it out!
```
  $ npx sql-code-generator version
  $ npx sql-code-generator generate
```


# Usage

## Resources

Resources should be defined in `.sql` files. We'll extract both the name and the type from the create definition automatically. For example:
```sql
CREATE TABLE `image` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `uuid` char(36) COLLATE utf8mb4_bin NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `url` varchar(190) COLLATE utf8mb4_bin NOT NULL,
  `caption` varchar(190) COLLATE utf8mb4_bin DEFAULT NULL,
  `credit` varchar(190) COLLATE utf8mb4_bin,
  `alt_text` varchar(190) COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`),
  UNIQUE KEY `image_ux1` (`url`,`caption`,`credit`,`alt_text`)
)
```

The above definition would generate the following typescript type definitions:
```ts
// types for table 'image'
export interface SqlTableImage {
  id: number;
  uuid: string;
  created_at: Date;
  url: string;
  caption: string | null;
  credit: string | null;
  alt_text: string | null;
}
```

## Queries
Queries can be defined in `.ts` or `.sql` files. If in a `.ts` file, this file should contain a named export called `query` exporting the sql of your query. We'll extract the name of the query from a specially formatted comment in your sql, e.g.: `-- query_name = find_images_by_url` would resolve a query name of `find_images_by_url`. For example:

```ts
export const query = `
-- query_name = find_images_by_url
SELECT
  i.uuid,
  i.url,
  i.caption,
  i.credit,
  i.alt_text
FROM image i
WHERE i.url = :url
`.trim();
```

The above definition would generate the following typescript type definitions:
```ts
// types for query 'find_images_by_url'
export interface SqlQueryFindImagesByUrlInput {
  url: SqlTableImage['url'];
}
export interface SqlQueryFindImagesByUrlOutput {
  uuid: SqlTableImage['uuid'];
  url: SqlTableImage['url'];
  caption: SqlTableImage['caption'];
  credit: SqlTableImage['credit'];
  alt_text: SqlTableImage['alt_text'];
}
```

And that same definition would also generate the following typescript query function:
```ts
import { mysql as prepare } from 'yesql';
import { query as sqlQueryFindImagesByUrlSql } from '../../dao/user/findAllByName';
import { SqlQueryFindImagesByUrlInput, SqlQueryFindImagesByUrlOutput } from './types';

// typedefs common to each query function
export type DatabaseExecuteCommand = (args: { sql: string; values: any[] }) => Promise<any[]>;
export type LogMethod = (message: string, metadata: any) => void;

// client method for query 'find_images_by_url'
export const sqlQueryFindImagesByUrl = async ({
  dbExecute,
  logDebug,
  input,
}: {
  dbExecute: DatabaseExecuteCommand;
  logDebug: LogMethod;
  input: SqlQueryFindImagesByUrlInput;
}): Promise<SqlQueryFindImagesByUrlOutput[]> => {
  // 1. define the query with yesql
  const { sql: preparedSql, values: preparedValues } = prepare(sqlQueryFindImagesByUrlSql)(input);

  // 2. log that we're running the request
  logDebug('sqlQueryFindImagesByUrl.input', { input });

  // 3. execute the query
  const output = await dbExecute({ sql: preparedSql, values: preparedValues });

  // 4. log that we've executed the request
  logDebug('sqlQueryFindImagesByUrl.output', { output });

  // 5. return the output
  return output;
};
```

# Commands
<!-- commands -->
* [`sql-code-generator generate`](#sql-code-generator-generate)
* [`sql-code-generator help [COMMAND]`](#sql-code-generator-help-command)

## `sql-code-generator generate`

generate typescript code by parsing sql definitions for types and usage

```
USAGE
  $ sql-code-generator generate

OPTIONS
  -c, --config=config  (required) [default: codegen.sql.yml] path to config yml
  -h, --help           show CLI help
```

_See code: [dist/contract/commands/generate.ts](https://github.com/uladkasach/sql-code-generator/blob/v0.0.0/dist/contract/commands/generate.ts)_

## `sql-code-generator help [COMMAND]`

display help for sql-code-generator

```
USAGE
  $ sql-code-generator help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_
<!-- commandsstop -->


# Contribution

Team work makes the dream work! Please create a ticket for any features you think are missing and, if willing and able, draft a PR for the feature :)

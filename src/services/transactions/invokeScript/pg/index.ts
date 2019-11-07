import { fromNullable, Maybe } from 'folktale/maybe';
import { head, propEq } from 'ramda';

import { PgDriver } from '../../../../db/driver';
import { matchRequestsResults } from '../../../../utils/db';

import { pgErrorMatching } from '../../../_common/utils';

import sql from './sql';
import { transformResult } from './transformResult';
import {
  RawInvokeScriptTx as DbRawInvokeScriptTx,
  RawInvokeScriptTx,
} from '../types';

export default {
  get: (pg: PgDriver) => (id: string) =>
    pg
      .any<DbRawInvokeScriptTx>(sql.get(id))
      .map(transformResult)
      .map<RawInvokeScriptTx>(head)
      .map(fromNullable)
      .mapRejected(
        pgErrorMatching({
          request: 'transactions.invokeScript.get',
          params: id,
        })
      ),

  mget: (pg: PgDriver) => (ids: string[]) =>
    pg
      .any<DbRawInvokeScriptTx>(sql.mget(ids))
      .map(transformResult)
      .map<Maybe<RawInvokeScriptTx>[]>(matchRequestsResults(propEq('id'), ids))
      .mapRejected(
        pgErrorMatching({
          request: 'transactions.invokeScript.mget',
          params: ids,
        })
      ),

  search: (pg: PgDriver) => (filters: Record<string, any>) =>
    pg
      .any<DbRawInvokeScriptTx>(sql.search(filters))
      .map(transformResult)
      .mapRejected(e =>
        pgErrorMatching({
          request: 'transactions.invokeScript.search',
          params: filters,
          message: e.error.message,
        })(e)
      ),
};

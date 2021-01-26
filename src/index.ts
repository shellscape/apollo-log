/*
  Copyright © 20219 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { ApolloServerPlugin, GraphQLRequestListener } from 'apollo-server-plugin-base';
import chalk from 'chalk';
import stringify from 'fast-safe-stringify';
import loglevel from 'loglevelnext';
import { customAlphabet } from 'nanoid';

export type LogMutateData = Record<string, string>;

export interface LogOptions {
  events: { [name: string]: boolean };
  mutate: (data: LogMutateData) => LogMutateData;
  prefix: string;
  timestamp: boolean;
}

const defaults: LogOptions = {
  events: {
    didEncounterErrors: true,
    didResolveOperation: false,
    executionDidStart: false,
    parsingDidStart: false,
    responseForOperation: false,
    validationDidStart: false,
    willSendResponse: true
  },
  mutate: (data: LogMutateData) => data,
  prefix: 'apollo',
  timestamp: false
};
const nanoid = customAlphabet('1234567890abcdef', 6);
const ignoredOps = ['IntrospectionQuery'];

const getLog = (options: LogOptions) => {
  const template = `${options.timestamp ? '[{{time}}] ' : ''}{{level}} `;
  const prefix = {
    level: ({ level }: { level: string }) =>
      chalk[level === 'info' ? 'blue' : 'red'](chalk`{inverse ${options.prefix}}`),
    template,
    time: () => new Date().toTimeString().split(' ')[0]
  };
  const log = loglevel.create({ level: 'info', name: 'apollo-log', prefix });

  return (id: string, data: unknown) => {
    const mutated = options.mutate?.(data as LogMutateData);
    log[(data as any).errors ? 'error' : 'info'](chalk`{dim ${id}}`, stringify(mutated));
  };
};

export const ApolloLogPlugin = (opts?: Partial<LogOptions>): ApolloServerPlugin => {
  const options: LogOptions = Object.assign({}, defaults, opts);
  const log = getLog(options);

  return {
    requestDidStart(context) {
      const operationId = nanoid();
      const ignore = ignoredOps.includes(context.operationName || '');

      if (!ignore) {
        const query = context.request.query?.replace(/\n/g, '');
        const variables = Object.keys(context.request.variables || {});
        log(operationId, {
          event: 'request',
          operationName: context.operationName,
          query,
          variables
        });
      }

      const { events } = options;
      const handlers: GraphQLRequestListener = {
        didEncounterErrors({ errors }) {
          events.didEncounterErrors && log(operationId, { event: 'errors', errors });
        },

        didResolveOperation({ metrics, operationName }) {
          events.didResolveOperation &&
            log(operationId, { event: 'didResolveOperation', metrics, operationName });
        },

        executionDidStart({ metrics }) {
          events.executionDidStart && log(operationId, { event: 'executionDidStart', metrics });
        },

        parsingDidStart({ metrics }) {
          events.parsingDidStart && log(operationId, { event: 'parsingDidStart', metrics });
        },

        responseForOperation({ metrics, operationName }) {
          events.responseForOperation &&
            log(operationId, { event: 'responseForOperation', metrics, operationName });
          return null;
        },

        validationDidStart({ metrics }) {
          events.validationDidStart && log(operationId, { event: '', metrics });
        },

        willSendResponse({ metrics }) {
          options.events.willSendResponse && log(operationId, { event: 'response', metrics });
        }
      };

      return handlers;
    }
  };
};

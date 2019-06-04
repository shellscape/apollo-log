/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

const chalk = require('chalk');
const { print } = require('graphql');
const loglevel = require('loglevelnext');

const colors = {
  trace: 'cyan',
  debug: 'magenta',
  info: 'blue',
  warn: 'yellow',
  error: 'red'
};

const defaults = {
  level: 'info',
  mutate: (level, data) => {}, // eslint-disable-line no-unused-vars
  prefix: 'apollo: ',
  timestamp: false
};

class ApolloLogExtension {
  constructor(options) {
    const opts = Object.assign({}, defaults, options);
    const template = `${opts.timestamp ? '[{{time}}] ' : ''}{{level}}`;
    const prefix = {
      level: ({ level }) => {
        const color = colors[level];
        return chalk[color](opts.prefix);
      },
      template,
      time: () => new Date().toTimeString().split(' ')[0]
    };

    const log = loglevel.create({ level: opts.level, name: 'apollo-log', prefix });

    this.log = {
      info: (args) => {
        const mutated = opts.mutate(...['info'].concat(args));
        log.info(mutated || args);
      },

      debug: (args) => {
        const mutated = opts.mutate(...['debug'].concat(args));
        log.debug(mutated || args);
      }
    };

    this.options = opts;
  }

  requestDidStart({ operationName, parsedQuery, queryString, request, variables }) {
    const query = queryString || print(parsedQuery);
    const { method, redirect, headers, parsedURL, signal } = request;
    const rawHeaders = headers.raw();

    for (const key of Object.keys(rawHeaders)) {
      const value = rawHeaders[key];
      rawHeaders[key] = value && value.length > 1 ? value : value[0];
    }

    this.log.info({ action: 'request', status: 'begin', operationName, query, variables });
    this.log.info({
      action: 'request',
      status: 'data',
      request: { method, redirect, headers: rawHeaders, parsedURL, signal }
    });

    return (...errors) => {
      if (errors.length) {
        this.log.error({ action: 'request', status: 'failed', errors }, '\n');
      }
    };
  }

  parsingDidStart({ queryString }) {
    this.log.debug({ action: 'parse', status: 'begin', queryString });
    return () => {
      this.log.debug({ action: 'parse', status: 'end', queryString });
    };
  }

  validationDidStart() {
    this.log.debug({ action: 'validation', status: 'begin' });
    return () => {
      this.log.debug({ action: 'validation', status: 'end' });
    };
  }

  executionDidStart(/* { executionArgs } */) {
    this.log.debug({ action: 'execute', status: 'begin' });
    return () => {
      this.log.debug({ action: 'execute', status: 'end' });
    };
  }

  willSendResponse({ graphqlResponse: response }) {
    const { data } = response;
    this.log.info({ action: 'response', status: 'data', data });
    this.log.info({ action: 'request', status: 'end', response }, '\n');
  }
}

module.exports = { ApolloLogExtension };

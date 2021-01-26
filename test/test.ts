/* eslint-disable import/first */
require('isomorphic-unfetch');

import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-server';
import test from 'ava';
import * as sinon from 'sinon';

import { LogMutateData } from '../src';

import { run } from './helpers/setup';

interface TestSpy {
  error?: sinon.SinonSpy;
  info?: sinon.SinonSpy;
}
type LogMethod = 'info' | 'error';

const methods: LogMethod[] = ['info', 'error'];
const sandbox = sinon.createSandbox();
const rLine = /apollo [0-9a-z]{0,6}/;

const spies: TestSpy = {};
const uri = 'http://localhost:55555/';
const query = gql`
  {
    batman
  }
`;

test.serial.before(() => {
  for (const method of methods) {
    spies[method] = sandbox.spy(console, method);
  }
});

test.serial.beforeEach(() => {
  for (const method of methods) {
    spies[method]?.resetHistory();
  }
});

test.serial.after(() => {
  sandbox.restore();
});

test.serial('logging', async (t) => {
  const server = await run({});
  const client = new ApolloClient({ uri });
  const result = await client.query({ query });
  t.snapshot(result);
  t.snapshot(spies.info?.callCount);

  const calls = spies.info?.getCalls().map((c) => {
    const [prefix, body] = c.args;
    t.truthy(rLine.test(prefix));
    return [prefix.replace(rLine, 'apollo <id>'), body];
  });
  t.snapshot(calls);

  await server.stop();
});

test.serial('events', async (t) => {
  const server = await run({
    events: {
      didEncounterErrors: false,
      didResolveOperation: false,
      executionDidStart: false,
      parsingDidStart: true,
      responseForOperation: false,
      validationDidStart: false,
      willSendResponse: false
    }
  });
  const client = new ApolloClient({ uri });
  const result = await client.query({ query });
  t.snapshot(result);
  t.is(spies.info?.callCount, 2);

  const calls = spies.info?.getCalls().map((c) => {
    const [prefix, body] = c.args;
    t.truthy(rLine.test(prefix));
    return [prefix.replace(rLine, 'apollo <id>'), body];
  });
  t.snapshot(calls);
  await server.stop();
});

test.serial('mutate', async (t) => {
  const server = await run({
    mutate: (data: LogMutateData) => Object.assign(data, { batman: 'joker' })
  });
  const client = new ApolloClient({ uri });
  const result = await client.query({ query });
  t.snapshot(result);
  t.is(spies.info?.callCount, 2);

  const calls = spies.info?.getCalls().map((c) => {
    const [prefix, body] = c.args;
    t.truthy(rLine.test(prefix));
    return [prefix.replace(rLine, 'apollo <id>'), body];
  });
  t.snapshot(calls);
  await server.stop();
});

test.serial('errors', async (t) => {
  const server = await run({});
  const client = new ApolloClient({ uri });
  try {
    await client.query({
      query: gql`
        {
          batmannnnnananana
        }
      `
    });
  } catch (e) {
    // noop
  }

  t.is(spies.info?.callCount, 2);
  t.is(spies.error?.callCount, 1);

  const calls = spies.error?.getCalls().map((c) => {
    const [prefix, body] = c.args;
    t.truthy(rLine.test(prefix));
    return [prefix.replace(rLine, 'apollo <id>'), body];
  });
  t.snapshot(calls);
  await server.stop();
});

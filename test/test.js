/* eslint-disable no-console */
require('isomorphic-unfetch');

const { default: ApolloClient } = require('apollo-boost');
const { gql } = require('apollo-server');
const test = require('ava');
const sinon = require('sinon');

const { ApolloLogExtension } = require('../lib/index');

const { run } = require('./helpers/setup');

const uri = 'http://localhost:55555/';
const query = gql`
  {
    batman
  }
`;

const methods = ['log', 'info'];
const sandbox = sinon.createSandbox();

test.before(() => {
  for (const method of methods) {
    if (console[method]) {
      // curiously, node 6 doesn't have console.debug
      sandbox.spy(console, method);
    }
  }
});

test.afterEach(() => {
  for (const method of methods) {
    if (console[method]) {
      console[method].resetHistory();
    }
  }
});

test.after(() => {
  sandbox.restore();
});

test('defaults', (t) => {
  const log = new ApolloLogExtension();
  t.snapshot(log.options);
});

test.serial('logging', async (t) => {
  const server = await run();
  const client = new ApolloClient({ uri });
  const result = await client.query({ query });
  t.snapshot(result);
  t.snapshot(console.log.callCount);
  t.snapshot(console.log.getCalls().map((c) => c.args));
  t.snapshot(console.info.callCount);
  t.snapshot(console.info.getCalls().map((c) => c.args));
  await server.stop();
});

test.serial('level', async (t) => {
  const server = await run({ level: 'debug' });
  const client = new ApolloClient({ uri });
  const result = await client.query({ query });
  t.snapshot(result);
  t.snapshot(console.log.callCount);
  t.snapshot(console.info.callCount);
  await server.stop();
});

test.serial('mutate', async (t) => {
  const server = await run({
    mutate: (level) => level
  });
  const client = new ApolloClient({ uri });
  const result = await client.query({ query });
  t.snapshot(result);
  t.snapshot(console.log.callCount);
  t.snapshot(console.log.getCalls().map((c) => c.args));
  t.snapshot(console.info.callCount);
  t.snapshot(console.info.getCalls().map((c) => c.args));
  await server.stop();
});

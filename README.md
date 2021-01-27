[tests]: 	https://img.shields.io/circleci/project/github/shellscape/apollo-log.svg
[tests-url]: https://circleci.com/gh/shellscape/apollo-log

[cover]: https://codecov.io/gh/shellscape/apollo-log/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/shellscape/apollo-log

[size]: https://packagephobia.now.sh/badge?p=apollo-log
[size-url]: https://packagephobia.now.sh/result?p=apollo-log

<div align="center">
	<img src='https://user-images.githubusercontent.com/841294/53402609-b97a2180-39ba-11e9-8100-812bab86357c.png' height='100' alt='Apollo Server'><br/><br/>
</div>

[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![size][size]][size-url]

# apollo-log

A logging plugin for Apollo GraphQL Server

:heart: Please consider [Sponsoring my work](https://github.com/sponsors/shellscape)

`apollo-server` doesn't ship with any comprehensive logging, and instead offloads that responsiblity to the users and the resolvers or context handler. That can be inconvenient. This module provides uniform logging for the entire GraphQL request lifecycle, as provided by plugin hooks in `apollo-server`. The console/terminal result of which will resemble the image below:

<img src="https://github.com/shellscape/apollo-log/raw/master/.github/screen.png" width="508">

## Requirements

`apollo-log` is an [evergreen 🌲](./.github/FAQ.md#what-does-evergreen-mean) module.

This module requires an [Active LTS](https://github.com/nodejs/Release) Node version (v10.23.1+).

## Install

Using npm:

```console
npm install apollo-log
```

## Usage

Setting up `apollo-log` is straight-forward. Import and call the plugin function, passing any desired options, and pass the plugin in an array to `apollo-server`.

```js
import { ApolloLogPlugin } from 'apollo-log';
import { ApolloServer } from 'apollo-server';

const options = { ... };
const plugins = [ApolloLogPlugin(options)];
const apollo = new ApolloServer({
  plugins,
  ...
});
```

Please see the [Apollo Plugins](https://www.apollographql.com/docs/apollo-server/integrations/plugins/#installing-a-plugin) documentation for more information.

## Options

### `events`
Type: `Record<string, boolean>`<br>
Default: ```js
{
  didEncounterErrors: true,
  didResolveOperation: false,
  executionDidStart: false,
  parsingDidStart: false,
  responseForOperation: false,
  validationDidStart: false,
  willSendResponse: true
}
```

Specifies which [Apollo lifecycle events](https://www.apollographql.com/docs/apollo-server/integrations/plugins/#apollo-server-event-reference) will be logged. The `requestDidStart` event is always logged, and by default `didEncounterErrors` and `willSendResponse` are logged.

### `mutate`
Type: `Function`
Default: `(data: Record<string, string>) => Record<string, string>`

If specified, allows inspecting and mutating the data logged to the console for each message.

#### `prefix`
Type: `String`<br>
Default: `apollo`

Specifies a prefix, colored by level, prepended to each log message.

#### `timestamp`
Type: `Boolean`

If `true`, will prepend a timestamp in the `HH:mm:ss` format to each log message.

## Meta

[CONTRIBUTING](./.github/CONTRIBUTING.md)

[LICENSE (Mozilla Public License)](./LICENSE)

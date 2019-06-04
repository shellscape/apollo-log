[tests]: 	https://img.shields.io/circleci/project/github/shellscape/webpack-plugin-serve.svg
[tests-url]: https://circleci.com/gh/shellscape/webpack-plugin-serve

[cover]: https://codecov.io/gh/shellscape/webpack-plugin-serve/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/shellscape/webpack-plugin-serve

[size]: https://packagephobia.now.sh/badge?p=webpack-plugin-serve
[size-url]: https://packagephobia.now.sh/result?p=webpack-plugin-serve

<div align="center">
	<img src='https://user-images.githubusercontent.com/841294/53402609-b97a2180-39ba-11e9-8100-812bab86357c.png' height='100' alt='Apollo Server'><br/><br/>
</div>

[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![size][size]][size-url]

# apollo-log

A logging extension for the Apollo GraphQL Server

<a href="https://www.patreon.com/shellscape">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

_Please consider donating if you find this project useful._

`apollo-server` doesn't ship with any comprehensive logging, and instead offloads that responsiblity to the users and the resolvers or context handler. That can be inconvenient. This module provides uniform logging for the entire GraphQL request lifecycle, as provided by extension hooks in `apollo-server`. The console/terminal result of which will resemble the image below:

<img src="https://github.com/shellscape/apollo-log/raw/master/.github/screen.png" width="508">

## Requirements

`apollo-log` is an [evergreen 🌲](./.github/FAQ.md#what-does-evergreen-mean) module.

This module requires an [Active LTS](https://github.com/nodejs/Release) Node version (v10.0.0+).

## Install

Using npm:

```console
npm install apollo-log
```

## Usage

Setting up `apollo-log` is straight-forward. Instantiate the extension, passing any desired options, and pass the extensions array to `apollo-server`.

```js
const { ApolloLogExtension } = require('apollo-log');
const { ApolloServer } = require('apollo-server');

const options = { ... };
const extensions = [() => new ApolloLogExtension(options)];
const apollo = new ApolloServer({
  extensions,
  ...
});
```

## Options

### `level`
Type: `String`<br>
Default: `info`

Specifies at which base level that log messages will be shown (typically `info` or `debug`). For more information please see the [`loglevelnext` documentation](https://github.com/shellscape/loglevelnext/blob/master/docs/LogLevel.md#level).

### `mutate`
Type: `Function`
Default: `(level, data) => {}`

If specified, allows inspecting and mutating the data logged to the console for each message. The `level` parameter is one of `info` or `debug`.

#### `prefix`
Type: `String`<br>
Default: `apollo: `

Specifies a prefix, colored by level, prepended to each log message.

#### `timestamp`
Type: `Boolean`

If `true`, will prepend a timestamp in the `HH:mm:ss` format to each log message.

## Meta

[CONTRIBUTING](./.github/CONTRIBUTING.md)

[LICENSE (Mozilla Public License)](./LICENSE)

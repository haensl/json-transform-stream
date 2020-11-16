# @haensl/json-transform-stream
A Node.js [Transform Stream](https://nodejs.org/dist/latest-v14.x/docs/api/stream.html#stream_class_stream_transform) implementation that makes wrapping JSON data easy.

[![NPM](https://nodei.co/npm/@haensl%2Fjson-transform-stream.png?downloads=true)](https://nodei.co/npm/@haensl%2Fjson-transform-stream/)

[![npm version](https://badge.fury.io/js/@haensl%2Fjson-transform-stream.svg)](http://badge.fury.io/js/@haensl%2Fjson-transform-stream)

[![CircleCI](https://circleci.com/gh/haensl/json-transform-stream.svg?style=svg)](https://circleci.com/gh/haensl/json-transform-stream)

## Installation

```bash
# via npm
npm i --save @haensl/json-transform-stream

# or yarn
yarn add @haensl/json-transform-stream
```

## Usage

```javascript
const JSONTransform = require('@haensl/json-transform-stream');

const jsonStream = getJSONObjectStreamFromSomewhere()
  .pipe(JSONTransform());

```

### Example: Streaming MongoDB cursors in [Koa](https://koajs.com/).
```javascript
const JSONTransform = require('@haensl/json-transform-stream');

// ...

router.get('/some-resource', async (ctx) => {
  // query your mongodb
  const cursor = await mongo
    .db('some-database')
    .collection('some-colletion')
    .find({
      // query
    });
  // don't forget to set the content type _before_ the first chunk
  ctx.set('Content-Type', 'application/json');
  ctx.status = 200;
  ctx.body = cursor
    .transformStream({
      transform: JSON.stringify // have the mongodb cursor emit JSON stringified chunks
    })
    .pipe(JSONTransform()); // wrap the chunks in an array
});
```

### Example: Safely streaming an array of JSON.

Since [sending plain arrays to clients is exploitable](https://cheatsheetseries.owasp.org/cheatsheets/AJAX_Security_Cheat_Sheet.html#protect-against-json-hijacking-for-older-browsers), you might want to wrap your array in an object.

```javascript
const JSONTransform = require('@haensl/json-transform-stream');

// ...

someJSONStream
  .pipe(JSONTransform({
    pre: '{"data":[',
    post: ']}'
  }));

// Result:
// {
//   "data": [
//      // data emitted by someJSONStream
//   ]
// }
}
```

## Synopsis

```javascript
({
  post = ']',
  pre = '[',
  separator = ','
}) => TransformStream
```

### Parameters

#### `options.post` _[optional]_
**Default:** `']'`

`String`. Suffix to append to data emitted by this stream.

#### `options.pre` _[optional]_
**Default:** `'['`

`String`. Prefix to prepend to data emitted by this stream.

#### `options.separator` _[optional]_
**Default:** `','`

`String`. Separator to join data emitted by this stream with.

### Returns

[`TransformStream`](https://nodejs.org/dist/latest-v14.x/docs/api/stream.html#stream_class_stream_transform). A Node.js transform stream.

## [Changelog](CHANGELOG.md)

## [License](LICENSE)

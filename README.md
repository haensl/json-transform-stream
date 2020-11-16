# json-transform-stream
A Node.js Transform Stream for JSON objects that makes wrapping JSON objects easy.

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

### Example: streaming MongoDB cursors in koa.
```javascript
const JSONTransform = require('@haensl/json-transform-stream');

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


## [Changelog](CHANGELOG.md)

## [License](LICENSE)

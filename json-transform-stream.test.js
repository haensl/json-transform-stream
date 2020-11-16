const { Readable } = require('stream');
const JSONTransform = require('./');

describe('json-transform-stream', () => {
  const data = [
    { index: 1 },
    { index: 2 },
    { index: 3 }
  ];

  const iterator = function* () {
    for (const d of data) {
      yield JSON.stringify(d);
    }
  };

  describe('defaults', () => {
    let streamed;

    beforeEach((done) => {
      const stream = Readable.from(iterator())
        .pipe(JSONTransform());

      stream.on('data', (data) => {
        streamed = `${streamed || ''}${data}`;
      });
      stream.on('end', done);
    });

    it('JSON stringifies the objects to an array', () => {
      expect(streamed)
        .toEqual(JSON.stringify(data));
    });
  });

  describe('pre/post', () => {
    let streamed;

    beforeEach((done) => {
      const stream = Readable.from(iterator())
        .pipe(JSONTransform({
          pre: '{"data":[',
          post: ']}'
        }));
      stream.on('data', (data) => {
        streamed = `${streamed || ''}${data}`;
      });
      stream.on('end', done);
    });

    it('Allows to setup custom wrapping', () => {
      expect(streamed)
        .toEqual(
          JSON.stringify({
            data
          })
        );
    });
  });

  describe('separator', () => {
    let streamed;

    beforeEach((done) => {
      const stream = Readable.from(iterator())
        .pipe(JSONTransform({
          post: '',
          pre: '',
          separator: ';'
        }));
      stream.on('data', (data) => {
        streamed = `${streamed || ''}${data}`;
      });
      stream.on('end', done);
    });

    it('Allows to setup custom wrapping', () => {
      expect(streamed)
        .toEqual(
          data.map((d) => JSON.stringify(d))
            .join(';')
        );
    });
  });
});

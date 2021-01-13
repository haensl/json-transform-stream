const { Transform } = require('stream');

module.exports = ({
  post = ']',
  pre = '[',
  separator = ','
} = {}) => {
  let first = true;

  return Transform({
    writeableObjectMode: true,
    transform: (chunk, encoding, callback) => {
      if (first) {
        first = false;
        console.log('chunky', chunk.toString());
        return callback(
          null,
          Buffer.concat([Buffer.from(pre), chunk])
        );
      }

      return callback(
        null,
        Buffer.concat([Buffer.from(separator), chunk])
      );
    },
    flush: function(callback) {
      if (first) {
        this.push(Buffer.from(pre));
      }

      this.push(Buffer.from(post));

      process.nextTick(callback);
    }
  });
};

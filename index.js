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
    final: function(callback) {
      if (first) {
        this.push(Buffer.from(pre));
      } else {
        this.push(Buffer.from(post));
      }

      process.nextTick(callback);
    }
  });
};

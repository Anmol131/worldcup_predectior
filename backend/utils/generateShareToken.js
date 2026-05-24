const { nanoid } = require('nanoid');

function generateShareToken() {
  return nanoid(8);
}

module.exports = generateShareToken;
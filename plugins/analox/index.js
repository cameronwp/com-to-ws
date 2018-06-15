const _ = require('lodash');

/**
 * Turn raw data into lines of text.
 * @param {Buffer} data
 * @returns {string[]}
 */
function getLines(data) {
  const line = data.toString('utf-8');
  // REM1 and REM2 lines may or may not be concatted together
  return line.split(String.fromCharCode(13)).filter(l => l.length > 0);
}

/**
 * Generate a simple checksum.
 * @param {string} str
 * @returns {string} a zero padded 4 digit hex checksum
 */
function checksum(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum = sum + str[i].charCodeAt(0);
  }
  return sum.toString(16).padStart(4, '0');
}

function validate(line) {
  const ckre = /CK\=(.{4})$/i;
  const result = ckre.exec(line);
  const foundChecksum = result[1];
  const index = result.index;
  const calculatedChecksum = checksum(line.substring(0, index - 2));
  return foundChecksum === calculatedChecksum;
}

/**
 * Parse data buffer from COM port into structured information.
 * @param {Buffer} data
 * @returns {Object} set of {datetime, ...sensor: value}
 */
function parse(data) {
  // note the swap for datetime - this is to allow capturing datetime the same
  // as we capture other values below
  const lines = getLines(data)
    .filter(validate)
    .map(l => l.replace('>', 'datetime='));

  const values = _
    .chain(lines)
    .map(line => line.split(', '))
    .flattenDeep()
    .map(v => v.split('='))
    .fromPairs()
    .value();

  return values;
}

module.exports = { getLines, checksum, validate, parse };

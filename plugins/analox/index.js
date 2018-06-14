const _ = require('lodash');

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
  if (foundChecksum !== calculatedChecksum) {
    console.error(
      `Checksum fail: found: ${foundChecksum}, calculated ${calculatedChecksum}`
    );
  } else {
    console.log('Good checksum');
  }
}

/**
 * Parse data stream into structured information.
 * @param {Buffer} data
 */
function parse(data) {
  const lines = getLines(data);
  lines.forEach(validate);
  // try {
  //   lines.forEach(l => validate);
  // } catch (e) {
  //   return console.error(e);
  // }

  // const pairs = _.flatMap(lines, l => l.split(', '));
  // console.log(pairs);
}

module.exports = { getLines, checksum, validate, parse };

const SerialPort = require('serialport');
const plugin = require('./plugins/analox/index');
const port = new SerialPort('/tmp/tty2');

port.on('error', console.error);
port.on('open', () => {
  console.log('Waiting for data...');
});

// just echo whatever is received
port.on('data', plugin.parse);

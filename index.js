const SerialPort = require('serialport');
const plugin = require('./plugins/analox/index');
const port = new SerialPort('/tmp/tty2');

port.on('error', console.error);
port.on('open', () => {
  console.log('Waiting for data...');
});

port.on('data', data => {
  const values = plugin.parse(data);
  // TODO: send to websockets
  console.log(values);
});

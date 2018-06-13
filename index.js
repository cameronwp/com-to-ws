const SerialPort = require('serialport');

// opens the port automatically
const port = new SerialPort('/dev/pts/7');

port.on('error', console.error);

port.on('open', () => {
  console.log("looks like we're open for biznazz");
});

// just echo whatever is received
port.on('data', data => {
  console.log(data.toString('utf-8'));
});

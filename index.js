const express = require('express');
const SerialPort = require('serialport');
const plugin = require('./plugins/analox/index');
const port = new SerialPort('/tmp/tty2');
const WebSocket = require('ws');

const app = express();
const expressWs = require('express-ws')(app);
const wsRouter = express.Router();

const wss = expressWs.getWss();

wss.broadcast = data => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

wsRouter.ws('/echo', (ws, req) => {
  ws.on('message', msg => {
    console.log(msg);
    ws.send(msg);
  });
});

wsRouter.ws('/realtime', (ws, req) => {
  ws.on('open', () => {
    console.log('opened');
  });
});

app.use('/ws', wsRouter);
app.listen(4000);

port.on('error', console.error);
port.on('open', () => {
  console.log('Waiting for data...');
});

port.on('data', data => {
  const values = plugin.parse(data);
  wss.broadcast(values);
  // TODO: send to websockets
  // console.log(values);
});

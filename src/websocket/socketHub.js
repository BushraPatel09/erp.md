let wss;

function initializeSocketHub(server) {
  const { WebSocketServer } = require('ws');
  wss = new WebSocketServer({ server });
  wss.on('connection', (socket) => {
    socket.send(JSON.stringify({ type: 'system.connected', payload: { message: 'Live backup telemetry connected' } }));
  });
}

function broadcast(type, payload) {
  if (!wss) return;
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type, payload }));
    }
  }
}

module.exports = { initializeSocketHub, broadcast };

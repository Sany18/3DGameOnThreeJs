const config = require('./config'),
      root = __dirname;

// ----http | express----
(() => {
  const express = require('express'),
        httpApp = new express(),
        drawLine = require('./libs/consoleLine.js');

  httpApp.use(express.static(root))

  httpApp.get('/', (request, res) => {
    res.set('Content-Type', 'text/plain')
    res.sendFile('index.html', { root })
  })

  let httpServer = httpApp.listen(config.serverPort, err => {
    if (err) { return log('something wrong happened', err) }

    drawLine({ http: config.serverPort, ws: config.wsPort })
  })
})()

// ----ws | chat----
const WebSocket = require('ws'),
      wsServer = new WebSocket.Server({ port: config.wsPort });
let userIdCounter = 0

wsServer.on('connection', ws => {
  ws.on('message', message => runCommands(wsServer, message))

  sendMessage(ws, JSON.stringify({ __id__: ++userIdCounter }))
  sendMessage(ws, 'welcome to Dark side')
});

function runCommands(wss, message) {
  if (message == 'password1Q') { httpServer.close() }
  if (message == 'chat database clear') { clearChatFile() }
  if (~message.indexOf('__pos__')) {
    return broadcast(wss, message)
  }

  // writeInChatArchive(message)
  broadcast(wss, message)
}

function broadcast(wss, message) {
  wss.clients.forEach(client => {
    client.send(
      JSON.stringify({ message, timestamp: Date() })
    )
  })
}

function sendMessage(ws, message) {
  ws.send(JSON.stringify({ message, timestamp: Date() }))
}

// ----fs | chat----
const fs = require('fs'),
      input = fs.createWriteStream(config.chatDbURN, { flags: 'a' }),
      output = fs.createReadStream(config.chatDbURN);

function writeInChatArchive(message) {
  input.write(buildLine({ message, timestamp: Date() }))
}

function buildLine(msg) {
  return `${msg.timestamp}${config.chatDbSeparator}${msg.message}\n`
}

function clearChatFile() {
  fs.writeFile(config.chatDbURN, '', err => err && log(err))
}

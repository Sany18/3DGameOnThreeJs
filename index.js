const config = require('./config'),
      root = __dirname;

// ----http | express----
(() => {
  const express = require('express'),
        httpApp = new express();
        h = config.serverPort,
        w = config.wsPort;

  httpApp.use(express.static(root))

  httpApp.get('/', (request, res) => {
    res.set('Content-Type', 'text/plain')
    res.sendFile('index.html', { root })
  })

  let httpServer = httpApp.listen(config.serverPort, err => {
    if (err) { return log('something wrong happened', err) }

    log('┌────────────┬────────────┐')
    log(`│ http: ${h} │  ws: ${w}  │`)
    log('└────────────┴────────────┘')
  })
})()

// ----ws | chat----
// const WebSocket = require('ws'),
//       wsServer = new WebSocket.Server({ port: config.wsPort });
// 
// function runCommands(message) {
//   if (message == 'password1Q') { httpServer.close() }
//   if (message == 'chat kill') { clearChatFile() }
// }
// 
// function sendMessage(ws, message) {
//   ws.send(JSON.stringify({
//     message, timestamp: Date()
//   }))
// }
// 
// wsServer.on('connection', ws => {
//   ws.on('message', message => {
//     runCommands(message)
//     writeInChatArchive(message)
//     sendMessage(ws, message)
//   })
// 
//   sendMessage(ws, 'welcome to Dark side')
// });

// ----fs | chat----
// const fs = require('fs'),
//       input = fs.createWriteStream(config.chatDbURN, { flags: 'a' }),
//       output = fs.createReadStream(config.chatDbURN);
// 
// function writeInChatArchive(message) {
//   input.write(buildLine({ message, timestamp: Date() }))
// }
// 
// function buildLine(msg) {
//   return `${msg.timestamp}${config.chatDbSeparator}${msg.message}\n`
// }
// 
// function clearChatFile() {
//   fs.writeFile(config.chatDbURN, '', err => err && log(err));
// }

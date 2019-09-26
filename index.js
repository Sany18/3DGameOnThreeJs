const config = require('./config');

const
  publicDir = require('path').join(__dirname, './'),
  express = require('express'),
  httpApp = new express(),
  WebSocket = require('ws'),
  wsServer = new WebSocket.Server({ port: config.wsPort })

httpApp.use(express.static(publicDir))

httpApp.get('/', (request, res) => {
  console.log("yep")
  res.set('Content-Type', 'text/plain')
  res.sendFile('index.html', { root: __dirname })
})

let httpServer = httpApp.listen(config.serverPort, (err) => {
  if (err) { return log('something bad happened', err) }
  log(`http server is listening on ${config.serverPort}`)
  log(`ws server is listening on ${config.wsPort}`)
})

function commands(message) {
  if (message == "password1Q") {
    httpServer.close()
  }
}

wsServer.on('connection', (ws) => {
  ws.on('message', (message) => {
    commands(message)
    // log('received: %s', message)
    ws.send(message)
  })

  ws.send('welcome to X3D ws server');
});

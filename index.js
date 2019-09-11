global.log = console.log

const 
  publicDir = require('path').join(__dirname, './'),
  express = require('express'),
  port = 3001, ws_port = 8080,
  httpApp = new express(),
  WebSocket = require('ws'),
  wsServer = new WebSocket.Server({ port: ws_port })

httpApp.use(express.static(publicDir))

httpApp.get('/', (request, res) => {
  console.log("yep")
  res.set('Content-Type', 'text/plain')
  res.sendFile('index.html', { root: __dirname })
})

let httpServer = httpApp.listen(port, (err) => {
  if (err) { return log('something bad happened', err) }
  log(`http server is listening on ${port}`)
  log(`ws server is listening on ${ws_port}`)
})

wsServer.on('connection', (ws) => {
  ws.on('message', (message) => {
    commands(message)
    // log('received: %s', message)
    ws.send(message)
  })
 
  ws.send('welcome to X3D ws server');
});

function commands(message) {
  if (message == "password1Q") {
    httpServer.close()
  }
}

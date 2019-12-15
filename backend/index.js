const config = require('../config.js')
const root = __dirname
const fs = require('fs')
const chatWrite = fs.createWriteStream(config.chatDbURN, { flags: 'a' })
const chatRead = fs.createReadStream(config.chatDbURN)
const drawConsoleLine = require('./libs/consoleLine.js')
const express = require('express')
const app = new express()
const path = require('path')
const privateKey = fs.readFileSync(root + '/ssl/private.key', 'utf8')
const certificate = fs.readFileSync(root + '/ssl/certificate.crt', 'utf8')
const credentials = { key: privateKey, cert: certificate }
const http = config.https ? require('https') : require('http')
const WebSocketServer = require('ws').Server
let userIdCounter = 0

/* ----http | express---- */
app.use(express.static(root))

const httpServer = config.https
  ? http.createServer(credentials, app)
  : http.createServer(app)

httpServer.listen(config.serverPort)

drawConsoleLine(config.https
  ? { 'https & wss': config.serverPort }
  : { 'http & ws': config.serverPort })

/* ----ws | chat---- */
const wsServer = new WebSocketServer({ server: httpServer })

wsServer.on('connection', ws => {
  ws.on('message', message => runCommands(wsServer, message))

  sendMessage(ws, JSON.stringify({ __id__: ++userIdCounter }))
  sendMessage(ws, 'welcome to Dark side')
})

function runCommands(wss, message) {
  if (message == 'password1Q') { httpServer.close(); httpServer.close() }
  if (message == 'chat database clear') { clearChatFile() }
  if (~message.indexOf('__pos__')) { return broadcast(wss, message) }

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

/* ----fs | chat---- */
function writeInChatArchive(message) {
  chatWrite.write(buildLine({ message, timestamp: Date() }))
}

function buildLine(msg) {
  return `${msg.timestamp}${config.chatDbSeparator}${msg.message}\n`
}

function clearChatFile() {
  fs.writeFile(config.chatDbURN, '', err => err && log(err))
}

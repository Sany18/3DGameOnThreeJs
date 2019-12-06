window.ws = new WebSocket(window.config.API_WS)
window.send = ws.send.bind(ws)
send.isOpen = false

document.querySelector('#chat').addEventListener('submit', e => {
  e.preventDefault()
  let value = e.target.lastElementChild.value

  if (value) send(value)
  e.target.lastElementChild.value = ''
})

ws.onerror = error => {
  send.isOpen = false
  addSystemMessageToChatWindow('[ws error]' + error.message)
}

ws.onopen = () => {
  send.isOpen = true

  addSystemMessageToChatWindow('[ws status]' + 'Соединение установлено.')
}

ws.onmessage = event => {
  const data = JSON.parse(event.data)

  if (~data.message.indexOf('__pos__')) {
    const player = JSON.parse(data.message)

    return networkPlayers[player.__pos__] = player
  }

  if (~data.message.indexOf('__id__')) {
    return myId = JSON.parse(data.message).__id__
  }

  if (~data.message.indexOf('__destroy__')) {
    const idToDelete = JSON.parse(data.message).__destroy__

    delete networkPlayers[idToDelete]
    scene.remove(definedNetworkPlayers[idToDelete])
    delete definedNetworkPlayers[idToDelete]
    return
  }

  addDataToChatWindow(data)
}

ws.onclose = (e) => {
  send.isOpen = false

  send('bye')

  e.wasClean
    ? log('[ws status]', 'Соединение закрыто чисто')
    : log('[ws status]', 'Обрыв соединения')

  addSystemMessageToChatWindow('[ws status] Код: ' + e.code + ' причина: ' + e.reason)
}

function addDataToChatWindow(data) {
  let localTime = localTimeFormat(data)
  let chatWindow = document.querySelector('.chat-messages-field')
  let message = document.createElement('div')
  let timeStamp = document.createElement('span')
  let massageText = document.createElement('span')

  message.className = 'chat-message'
  timeStamp.className = 'chat-timestamp'
  massageText.className = 'chat-massage-text'

  timeStamp.innerHTML = localTime
  massageText.innerHTML = data.message

  message.appendChild(timeStamp)
  message.appendChild(massageText)
  chatWindow.appendChild(message)

  chatWindow.scrollTop = chatWindow.scrollHeight
}

function addSystemMessageToChatWindow(data) {
  let chatWindow = document.querySelector('.chat-messages-field')
  let message = document.createElement('div')
  let timeStamp = document.createElement('span')

  message.className = 'chat-message'
  timeStamp.className = 'chat-timestamp'
  timeStamp.innerHTML = data

  message.appendChild(timeStamp)
  chatWindow.appendChild(message)

  chatWindow.scrollTop = chatWindow.scrollHeight
}

function localTimeFormat(data) {
  const d = new Date(data.timestamp);
  const localTime = `${d.getFullYear()}/${zr(d.getMonth()+1)}/${zr(d.getDate())} `+
                    `${d.getHours()}:${zr(d.getMinutes())} `
  return localTime;
}

function zr(value) { return value >= 10 ? value : '0' + value }

// client
let ws = new WebSocket(window.config.API_WS)
window.send = ws.send.bind(ws)

ws.onopen = () => log('[ws status]', 'Соединение установлено.')
ws.onmessage = e => log('[ws message]', e.data)
ws.onerror = error => log('[ws error]', error.message)

ws.onclose = (e) => {
  e.wasClean
    ? log('[ws status]', 'Соединение закрыто чисто')
    : log('[ws status]', 'Обрыв соединения')

  log('[ws status]', 'Код: ' + e.code + ' причина: ' + e.reason)
}

let ws = new WebSocket(window.config.API_WS)
window.send = ws.send.bind(ws)

document.addEventListener("DOMContentLoaded", _ => {
  document.querySelector("#chat").addEventListener("submit", (e) => {
    e.preventDefault()
    let value = e.target.lastElementChild.value

    if (value) send(value)
    e.target.lastElementChild.value = ""
  })
})

ws.onerror = error => log("[ws error]", error.message)

ws.onopen = () => {
  log("[ws status]", "Соединение установлено.")

  fetch(config.chatDbURN)
    .then(response => response.text())
    .then(body => {
      const messages = body.split("\n");
      for (var i = 0; i < messages.length - 1; ++i) {
        let message = messages[i].split(config.chatDbSeparator)
        message = { message: message[1], timestamp: message[0] }
        addMessageToChatWindow(message)
      }
    })
}

ws.onmessage = e => {
  let data = JSON.parse(e.data)
  log("[ws message]", data)

  addMessageToChatWindow(data)
}

ws.onclose = (e) => {
  e.wasClean
    ? log("[ws status]", "Соединение закрыто чисто")
    : log("[ws status]", "Обрыв соединения")

  log("[ws status]", "Код: " + e.code + " причина: " + e.reason)
}

function addMessageToChatWindow(data) {
  let localTime = localTimeFormat(data)
  let chatWindow = document.querySelector(".chat-messages-field")
  let message = document.createElement("div")
  let timeStamp = document.createElement("span")
  let massageText = document.createElement("span")

  message.className = "chat-message"
  timeStamp.className = "chat-timestamp"
  massageText.className = "chat-massage-text"

  timeStamp.innerHTML = localTime
  massageText.innerHTML = data.message

  message.appendChild(timeStamp)
  message.appendChild(massageText)
  chatWindow.appendChild(message)

  chatWindow.scrollTop = chatWindow.scrollHeight
}

function localTimeFormat(data) {
  const d = new Date(data.timestamp);
  const localTime = `${d.getFullYear()}-${zr(d.getMonth()+1)}-${zr(d.getDate())} `+
                    `${d.getHours()}:${zr(d.getMinutes())}:${zr(d.getSeconds())} `
  return localTime;
}

function zr(value) {
  return value >= 10 ? value : "0" + value
}

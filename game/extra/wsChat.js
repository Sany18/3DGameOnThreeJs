let ws = new WebSocket(window.config.API_WS)
window.send = ws.send.bind(ws)

ws.onopen = () => log("[ws status]", "Соединение установлено.")
ws.onerror = error => log("[ws error]", error.message)
ws.onmessage = e => {
  let data = JSON.parse(e.data)
  let localTime = data.timestamp.toString().slice(0, 9) + " "
      localTime += new Date(data.timestamp).toString().split(" ")[4] + " "
  log("[ws message]", data)

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

ws.onclose = (e) => {
  e.wasClean
    ? log("[ws status]", "Соединение закрыто чисто")
    : log("[ws status]", "Обрыв соединения")

  log("[ws status]", "Код: " + e.code + " причина: " + e.reason)
}

document.addEventListener("DOMContentLoaded", _ => {
  document.querySelector("#chat").addEventListener("submit", (e) => {
    e.preventDefault()
    let value = e.target.lastElementChild.value
    
    if (value) send(value)
    e.target.lastElementChild.value = ""
  })
})

let d = document

d.querySelector('.load-game').addEventListener('click', e => {
  loadGameTo('.content')
})

d.querySelector('.pause').addEventListener('click', e => {
  pause = !pause
})

d.querySelector('.unload').addEventListener('click', e => {
  globalFunctions.unload()
  d.querySelector('.content').innerHTML = ''
})

/* autoload */
d.querySelector('.load-game').click()


function loadGameTo(queryElem) {
  if (d.querySelector('.game-dark-side')) return

  let content = d.querySelector(queryElem)

  let blocker = d.createElement('div'); blocker.setAttribute('id', 'blocker')
  let blockerMenu = d.createElement('span'); blockerMenu.setAttribute('id', 'menu-button')
  blockerMenu.innerHTML = 'Menu'; blocker.appendChild(blockerMenu)
  content.appendChild(blocker)

  let consol = d.createElement('div'); consol.setAttribute('id', 'console')
  let consolInput = d.createElement('input'); consolInput.setAttribute('id', 'console_input')
  let consolText = d.createElement('span'); consolText.setAttribute('id', 'console_text')
  consol.appendChild(consolInput); consol.appendChild(consolText)
  content.appendChild(consol)

  let chatForm = d.createElement('form'); chatForm.setAttribute('id', 'chat')
  let chatMassages = d.createElement('div'); chatMassages.setAttribute('class', 'chat-messages-field')
  let chatInput = d.createElement('input'); chatInput.setAttribute('class', 'chat-input')
  chatInput.setAttribute('type', 'text')
  chatForm.appendChild(chatMassages)
  chatForm.appendChild(chatInput)
  content.appendChild(chatForm)

  let scriptTag = d.createElement('script')
  scriptTag.setAttribute('type', 'module')
  scriptTag.setAttribute('src', './game/game.js')
  scriptTag.setAttribute('class', 'game-dark-side game')
  d.head.appendChild(scriptTag)

  // <form id="chat">
  //   <div class="chat-messages-field"></div>
  //   <input class="chat-input" type="text">
  // </form>

  // scriptTag.addEventListener("load", () => log('[loaded]'))
}

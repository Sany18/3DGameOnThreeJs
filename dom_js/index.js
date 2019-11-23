let d = document

d.querySelector('.load-game').addEventListener('click', e => {
  if (d.querySelector('.game-dark-side')) return

  let content = d.querySelector('.content')

   let blocker = d.createElement('div'); blocker.setAttribute('id', 'blocker')
   let menu = d.createElement('span'); menu.setAttribute('id', 'menu-button')
   menu.innerHTML = 'Menu'; blocker.appendChild(menu)
   content.appendChild(blocker)

  let consol = d.createElement('div'); consol.setAttribute('id', 'console')
  let input = d.createElement('input'); input.setAttribute('id', 'console_input')
  let consolText = d.createElement('span'); consolText.setAttribute('id', 'console_text')
  consol.appendChild(input); consol.appendChild(consolText)
  content.appendChild(consol)

  let scriptTag = d.createElement('script')
  scriptTag.setAttribute('type', 'module')
  scriptTag.setAttribute('src', './game/game.js')
  scriptTag.setAttribute('class', 'game-dark-side game')
  d.head.appendChild(scriptTag)

  // <form id="chat">
  //   <div class="chat-messages-field"></div>
  //   <input class="chat-input" type="text">
  // </form>

  scriptTag.addEventListener("load", () => log('[loaded]'))
})

d.querySelector('.unload').addEventListener('click', e => {
  globalFunctions.unload()
  d.querySelector('.content').innerHTML = ''
})

/* autoload */
d.querySelector('.load-game').click()

!function customConsole() {
  let customConsole = document.getElementById('console')
  let customConsoleText = document.getElementById('console_text')
  let customConsoleInput = document.getElementById('console_input')

  let addText = (msg) => {
    customConsoleText.innerHTML += '<br>' + msg
  }

  let clearInput = () => {
    customConsoleInput.value = ''
  }

  let commands = {
    help: () => {
      addText('<br>help:')
      addText(' - show config: config')
      addText(' - show help: help')
      addText(' - clear console: clear')
      addText('<br>set property:')
      addText(' - gravity 9.8 <br>&ensp;')
      clearInput()
    },
    config: () => {
      addText('<br>')
      for (var key in window.config) {
        addText(key + ': ' + window.config[key])
      }
      clearInput()
    },
    clear: () => {
      customConsoleText.innerHTML = ''
      clearInput()
    },
    setConfig: (value) => {
      let arr = value.split(' ')

      if (arr[0] in window.config) {
        if (arr[1] == 'true') arr[1] = true
        if (arr[1] == 'false') arr[1] = false

        window.config[arr[0]] = arr[1]
        addText('assigned ' + value)
        clearInput()

        globalFunctions.onChangeProperties(arr[0])
      } else addText('command not found')
    }
  }

  addText('Custom console v0.0.2')
  // commands.help()

  // !function () {
  //   let log = console.log
  //   console.log = function(msg) {
  //     addText(msg)
  //     log.call(this, ...arguments)
  //   }
  // }()

  document.addEventListener('keydown', (e) => {
    if (e.keyCode == 192) {
      e.preventDefault()

      if (document.pointerLockElement) {
        customConsole.classList.add('visible')
        document.exitPointerLock()
        customConsoleInput.select()
      } else {
        customConsole.classList.remove('visible')
        document.body.requestPointerLock()
      }
    }
  }, false)

  customConsoleInput.addEventListener('keypress', (e) => {
    if (e.keyCode == 13) {
      e.preventDefault()

      switch(e.target.value) {
        case 'help': commands.help(); break;
        case 'config': commands.config(); break;
        case 'clear': commands.clear(); break;
        default: commands.setConfig(e.target.value); break;
      }
    }
  })
}()

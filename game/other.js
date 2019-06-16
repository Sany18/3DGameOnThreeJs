// document.body.contentEditable=true
// getEventListeners($(‘selector’))
// console.table(variableName)

!function customConsole() {
	let customConsole = document.getElementById('console')
	let customConsoleText = document.getElementById('console_text')
	let customConsoleInput = document.getElementById('console_input')

	let addText = function(msg) {
		customConsoleText.innerHTML += '<br>' + msg
	}

	addText('Custom console v0.0.1')

	let help = function() {
		for (var key in window.config) {
			console.log(key)
		}
	}

	!function () {
		let log = console.log
		console.log = function(msg) {
			addText(msg)
			log.call(this, ...arguments)
		}
	}()

	document.addEventListener('keydown', function(e) {
		if (e.keyCode == 192) {
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

	customConsoleInput.addEventListener('keypress', function(e) {
		if (e.keyCode == 13) {
			switch(e.target.value) {
				case 'help': help(); break;
			}

			e.preventDefault()
			eval('window.config.' + e.target.value)
		}
	})
}()

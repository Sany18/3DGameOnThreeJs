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

	let commands = {
		help: () => {
			addText('<br>help:')
			addText(' - show config: config')
			addText(' - show help: help')
			addText(' - clear console: clear')
			addText('<br>set property:')
			addText(' - gravity 9.8 <br>&ensp;')
		},
		config: () => {
			addText('<br>')
			for (var key in window.config) {
				addText(key + ': ' + window.config[key])
			}
		},
		clear: () => {
			customConsoleText.innerHTML = ''
		},
		setConfig: (value) => {
			let arr = value.split(' ')

			if (arr[0] in window.config) {
				if (arr[1] == 'true') arr[1] = true
				if (arr[1] == 'false') arr[1] = false

				window.config[arr[0]] = arr[1]
				addText('assigned ' + value); value = ''
				THREE.globalFunctions.onChangeProperties(arr[0])
			} else {
				addText('command not found')
			}
		}
	}

	addText('Custom console v0.0.2')
	// commands.help()

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

// add fileSize property to Number
Object.defineProperty(Number.prototype,'fileSize',{value:function(a,b,c,d){
 return (a=a?[1e3,'k','B']:[1024,'K','iB'],b=Math,c=b.log,
 d=c(this)/c(a[0])|0,this/b.pow(a[0],d)).toFixed(2)
 +' '+(d?(a[1]+'MGTPEZY')[--d]+a[2]:'Bytes');
},writable:false,enumerable:false})

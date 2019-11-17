let config = {
  serverPort: 80,
  wsPort: 9852,

  shadowResolution: 2048,
  resolutionMultiplier: 1,

  moveSpeed: 40,
  yourMass: 100.0,
  gravity: 9.8,
  jumpHeight: 25,

  debug: true,
  enableShadows: true,
  showAxes: true,
  showFps: true,

  volume: 100,
  music: 10,

  chatDbSeparator: '|-=-|',
  chatDbURN: './db/chat.ssv'
}

try {
  if (window) {
    config['API_WS'] = `ws://${location.hostname}:${config.wsPort}`
    config['imagePrefix'] = `${origin}/assets/textures/`
    config['threeJsVersion'] = THREE.getVersion

    config.debug && console.info('Debug mode on')

    window.assets = addr => `${origin}/assets/${addr}`
    window.log = console.log
    window.config = config
  }
} catch {}

try {
  if (global) {
    global.log = console.log
    module.exports = config
  }
} catch {}

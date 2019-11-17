let config = {
  serverPort: 8080,
  wsPort: 80,

  shadowResolution: 2048,
  resolutionMultiplier: 1,
  antialias: false,

  moveSpeed: 40,
  yourMass: 100.0,
  gravity: 9.8,
  jumpHeight: 40,

  debug: true,
  enableShadows: true,
  showAxes: true,
  showFps: true,
  showTesturesSize: true,

  volume: 100,
  music: 50,

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

let config = {
  serverPort: 81,
  wsPort: 82,

  shadowResolution: 2048,
  resolutionMultiplier: 1,
  antialias: false,

  moveSpeed: 100.0,
  yourMass: 1.0,
  gravity: 980,
  jumpHeight: 200,

  debug: true,
  enableShadows: true,
  showFps: true,
  showTesturesSize: true,

  volume: 100,
  music: 0,

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
    config.serverPort = process.env.PORT || config.serverPort

    global.log = console.log
    module.exports = config
  }
} catch {}

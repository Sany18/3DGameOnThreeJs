let config = {
  debug: true,

  serverPort: 8082,
  https: false,

  shadowResolution: 2048,
  resolutionMultiplier: 1,
  antialias: false,
  enableShadows: true,

  moveSpeed: 100.0,
  yourMass: 1.0,
  gravity: 980,
  jumpHeight: 180,

  showFps: true,
  showTesturesSize: true,
  showNamesOverPlayer: true,

  sounds: 99,
  music: 50,

  chatDbSeparator: '|-=-|',
  chatDbURN: './backend/db/chat.ssv'
}

try {
  if (window) {
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

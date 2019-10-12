let config = {
  serverPort: 6020,
  wsPort: 6030,
  textures: 9,
  shadowResolution: 2048,
  resolutionMultiplier: 1,
  moveSpeed: 40,
  yourMass: 100.0,
  gravity: 9.8,
  jumpHeight: 25,
  debug: true,
  enableShadows: true,
  showAxes: false,
  showTesturesSize: true,
  helperLight: false
}

try {
  if (window) {
    config['API_WS'] = `ws://${location.hostname}:${config.wsPort}`
    config['imagePrefix'] = `${origin}/assets/textures/`
    config['threeJsVersion'] = THREE.getVersion

    config.debug && console.info("Debug mode on")

    if (window.location.protocol == "https:") window.location.protocol = "http:";

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

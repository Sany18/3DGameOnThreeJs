console.time('Scripts loaded')
import { Player, DirectionLight, Floor, Skybox,
         Weapon, Boxes, RightHand, AnotherPlayer,
         Walls } from './prefabs/index.js'
import Stats from '../libs/stats.js'
import './index.js'

const main = () => {
  /**************/
  /* Initialize */
  /**************/

  window.scene = new THREE.Scene()
  let clock = new THREE.Clock()
  let stats = new Stats()
  let objects = []
  let state = {
    camera: {
      angle: 75,
      far: 1000,
      near: .1
    },
    frame: {
      elem: document.querySelector('.content'),
      width: () => document.querySelector('.content').offsetWidth,
      height: () => (document.querySelector('.content').offsetHeight - 5)
    }
  }

  /* physis */
  Physijs.scripts.worker = '/libs/physis/physijs_worker.js'
  Physijs.scripts.ammo = '/libs/physis/ammo.js'
  scene = new Physijs.Scene({ reportsize: 60, fixedTimeStep: 1 / 60 })
  scene.setGravity(new THREE.Vector3(0, -config.gravity, 0))

  /* camera */
  let camera = new THREE.PerspectiveCamera(
    state.camera.angle, state.frame.width() / state.frame.height(),
    state.camera.near, state.camera.far
  )

  let listener = new THREE.AudioListener()
  let sound = new THREE.Audio(listener) // background music
  camera.add(listener)

  /* renderer */
  let renderer = new THREE.WebGLRenderer({ antialias: config.antialias })
  renderer.setPixelRatio(devicePixelRatio * config.resolutionMultiplier)
  renderer.setSize(state.frame.width(), state.frame.height())
  renderer.shadowMap.enabled = true
  renderer.shadowMapSoft = true
  renderer.shadowCameraNear = 3
  renderer.shadowCameraFar = camera.far
  renderer.shadowCameraFov = 50
  renderer.shadowMapBias = 0.0039
  renderer.shadowMapDarkness = .5
  renderer.shadowMapWidth = 1024
  renderer.shadowMapHeight = 1024
  state.frame.elem.appendChild(renderer.domElement)

  /* filters / shaders */
  let composer = new THREE.EffectComposer(renderer)
  composer.addPass(new THREE.RenderPass(scene, camera))

  /* glitches */
  // let glitchPass = new THREE.GlitchPass()
  // composer.addPass(glitchPass)
  // glitchPass.goWild = false

  /* blur */
  // let hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader)
  // let vblur = new THREE.ShaderPass(THREE.VerticalBlurShader)
  // vblur.renderToScreen = true
  // composer.addPass(hblur)
  // composer.addPass(vblur)

  /* film */
  // let filmPass = new THREE.FilmPass(1, .2, 648, false)
  // composer.addPass(filmPass)

  /* global listeners */
  addEventListener('resize', () => {
    camera.aspect = state.frame.width() / state.frame.height()
    camera.updateProjectionMatrix()
    renderer.setSize(state.frame.width(), state.frame.height())
    composer.setSize(state.frame.width(), state.frame.height())
  }, false)

  let isSoundsEnable = false
  document.querySelector('.sounds').addEventListener('click', () => {
    isSoundsEnable = !isSoundsEnable
    
    if (isSoundsEnable) {
      document.querySelector('.sounds').innerHTML = 'Sounds on'
      sound.setVolume(config.music / 100)
    } else {
      document.querySelector('.sounds').innerHTML = 'Sounds off'
      sound.setVolume(0)
    }
  })

  globalFunctions.onBlocker = state => {
    // glitchPass.enabled = state
    // hblur.enabled = state
    // vblur.enabled = state
    // filmPass.uniforms.grayscale.value = state
  }

  // window.onbeforeunload = function() { return '' }

  addEventListener('unload', () => {
    send(JSON.stringify({ __destroy__: myId }))
    send('bye ' + myId)
  })

  /********************/
  /* After initialize */
  /********************/

  /* objects */
  Skybox(scene)
  Floor(scene)
  Boxes(scene, 1)
  DirectionLight(scene)
  Weapon(camera)
  Walls(scene)
  scene.fog = new THREE.Fog(0xc20000)

  window.player = new Player(camera, scene)

  let raycaster = new THREE.Raycaster()
  addEventListener('click', () => {
    let position = camera.getWorldPosition(new THREE.Vector3())
    let direction = camera.getWorldDirection(new THREE.Vector3())

    raycaster.set(position, direction)

    raycaster.intersectObjects(scene.children, true).forEach(i => {
      if (i.object.name == 'box') console.log('hit box')
      if (i.object.name == 'wall') console.log('hit wall')
      if (i.object.name == 'realPlayer') {
        send('i heat ' + i.object.networkId)
      }
    })
  })

  /* music */
  let audioLoader = new THREE.AudioLoader()
  audioLoader.load(assets("music/Tommy - Flyin'.mp3"), buffer => {
    sound.setBuffer(buffer)
    sound.setLoop(true)
    sound.setVolume(0)
    sound.play()
  })

  /* network */
  window.pause = false
  window.networkPlayers = {}
  window.definedNetworkPlayers = {}
  window.myId = 0

  function updateNetworkPlayers() {
    for (let key in window.networkPlayers) {
      if (networkPlayers[key].__pos__ != myId) {
        setNetworkPlayerPosition(
          key,
          networkPlayers[key].position,
          networkPlayers[key].quaternion
        )
      }
    }

    const players = Object.keys(networkPlayers).length
    document.querySelector('#players_online').innerHTML = players
  }

  function setNetworkPlayerPosition(__id__, pos, qua) {
    if (definedNetworkPlayers[__id__]) {
      definedNetworkPlayers[__id__].position.set(pos.x, pos.y, pos.z)
      definedNetworkPlayers[__id__].quaternion.set(qua._x, qua._y, qua._z, qua._w)
    } else {
      definedNetworkPlayers[__id__] = new AnotherPlayer(scene, __id__)
    }
  }

  function sendOwnCoordinates() {
    if (!send.isOpen || !myId) { return }

    send(JSON.stringify({
      __pos__: myId,
      position: player.body.position,
      quaternion: player.body.quaternion
    }))
  }

  /* action */
  function action(time, delta) {
    if (config.showFps) stats.showFps().showMemory()

    sendOwnCoordinates()
    updateNetworkPlayers()

    player.control()
  }

  !function animate(time, delta = clock.getDelta()) {
    action(time, delta)
    scene.simulate()
    composer.render()

    if (!pause) requestAnimationFrame(animate)
  }()

  console.timeEnd('Scripts loaded')
}

main()

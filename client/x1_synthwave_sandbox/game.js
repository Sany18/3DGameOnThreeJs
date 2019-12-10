console.time('Scripts loaded')
import { Player, DirectionLight, Floor, Skybox,
         Weapon, Boxes, RightHand, AnotherPlayer,
         Walls } from './game/prefabs/index.js'
import Stats from '../libs/stats.js'
import './game/index.js'

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
    }
  }

  /* physis */
  Physijs.scripts.worker = '/libs/physis/physijs_worker.js'
  Physijs.scripts.ammo = '/libs/physis/ammo.js'
  scene = new Physijs.Scene({ reportsize: 60, fixedTimeStep: 1 / 60 })
  scene.setGravity(new THREE.Vector3(0, -config.gravity, 0))

  /* camera */
  let camera = new THREE.PerspectiveCamera(
    state.camera.angle, window.innerWidth / window.innerHeight,
    state.camera.near, state.camera.far
  )

  let listener = new THREE.AudioListener()
  let music = new THREE.Audio(listener)
  camera.add(listener)

  /* renderer */
  let renderer = new THREE.WebGLRenderer({ antialias: config.antialias })
  renderer.setPixelRatio(devicePixelRatio * config.resolutionMultiplier)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMapSoft = true
  renderer.shadowCameraNear = 3
  renderer.shadowCameraFar = camera.far
  renderer.shadowCameraFov = 50
  renderer.shadowMapBias = 0.0039
  renderer.shadowMapDarkness = .5
  renderer.shadowMapWidth = 1024
  renderer.shadowMapHeight = 1024
  document.body.appendChild(renderer.domElement)

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
  // composer.addPass(hblu, '[test player]'r)
  // composer.addPass(vblur)

  /* film */
  // let filmPass = new THREE.FilmPass(1, .2, 648, false)
  // composer.addPass(filmPass)

  /* global listeners */
  addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
  }, false)

  // let isMusicEnable = false
  // document.querySelector('.music').addEventListener('click', () => {
  //   isMusicEnable = !isMusicEnable
  //
  //   if (isMusicEnable) {
  //     document.querySelector('.music').innerHTML = 'Music on'
  //     music.setVolume(config.music / 100)
  //   } else {
  //     document.querySelector('.music').innerHTML = 'Music off'
  //     music.setVolume(0)
  //   }
  // })

  // let isSoundsEnable = false
  // document.querySelector('.sounds').addEventListener('click', () => {
  //   isSoundsEnable = !isSoundsEnable
  //
  //   isSoundsEnable
  //    ? document.querySelector('.sounds').innerHTML = 'Sounds on'
  //    : document.querySelector('.sounds').innerHTML = 'Sounds off'
  // })

  globalFunctions.onBlocker = state => {
    // glitchPass.enabled = state
    // hblur.enabled = state
    // vblur.enabled = state
    // filmPass.uniforms.grayscale.value = state
  }

  addEventListener('unload', () => {
    send(JSON.stringify({ __destroy__: myId }))
    send('bye ' + myId)
  })

  /********************/
  /* After initialize */
  /********************/

  /* music */
  let musicLoader = new THREE.AudioLoader()
  musicLoader.load(assets("music/Tommy - Flyin'.mp3"), buffer => {
    music.setBuffer(buffer)
    music.setLoop(true)
    music.setVolume(0)
    music.play()
  })

  /* objects */
  Skybox(scene)
  Floor(scene)
  Boxes(scene, 1)
  DirectionLight(scene)
  Walls(scene)
  let weapon = Weapon(camera, listener)
  scene.fog = new THREE.Fog(0xc20000)

  window.player = new Player(camera, scene)

  let testPlayer = new AnotherPlayer(scene, '[test player]')

  let raycaster = new THREE.Raycaster()
  addEventListener('click', () => {
    let position = camera.getWorldPosition(new THREE.Vector3())
    let direction = camera.getWorldDirection(new THREE.Vector3())

    // if (isSoundsEnable) {
    //   weapon.sound.isPlaying && weapon.sound.stop()
    //   weapon.sound.play()
    // }

    raycaster.set(position, direction)

    raycaster.intersectObjects(scene.children, true).forEach(i => {
      if (i.object.name == 'box') console.log('hit box')
      if (i.object.name == 'wall') console.log('hit wall')
      if (i.object.name == 'realPlayer') {
        send('i heat ' + i.object.networkId)
      }
    })
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
    parent.document.querySelector('#players_online').innerHTML = players
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

    testPlayer.rotation.y += .02

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

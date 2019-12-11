import { DirectionLight, Floor } from './objects/index.js'
import Stats from '../libs/stats.js'
import './imports.js'

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

  /* camera */
  window.camera = new THREE.PerspectiveCamera(
    state.camera.angle, window.innerWidth / window.innerHeight,
    state.camera.near, state.camera.far
  )
  camera.y = 1
  scene.add(camera)

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
  Floor(scene)
  DirectionLight(scene)
  scene.fog = new THREE.Fog(0xc20000)

  /* action */
  function action(time, delta) {
    if (config.showFps) stats.showFps().showMemory()
  }

  !function animate(time, delta = clock.getDelta()) {
    action(time, delta)
    composer.render()
  }()
}

main()

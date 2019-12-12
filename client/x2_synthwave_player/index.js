import { DirectionLight, Floor, FlyCameraControl, Skybox } from './objects/index.js'
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
  let camera = new THREE.PerspectiveCamera(
    state.camera.angle, window.innerWidth / window.innerHeight,
    state.camera.near, state.camera.far
  )
  camera.position.y = 5
  camera.position.z = 20

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

  /* blur */
  // let hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader)
  // let vblur = new THREE.ShaderPass(THREE.VerticalBlurShader)
  // vblur.renderToScreen = true
  // composer.addPass(hblur)
  // composer.addPass(vblur)

  /* film */
  let filmPass = new THREE.FilmPass(1, .2, 648, false)
  composer.addPass(filmPass)

  /* global listeners */
  addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
  }, false)


  /* analyser */
  // const player = document.getElementById('player')

  let analyser, dataArray = false
  const handleSuccess = stream => {
    const context = new AudioContext()
    const source = context.createMediaStreamSource(stream)
    analyser = context.createAnalyser()

    source.connect(analyser)
    analyser.connect(context.destination)
    analyser.fftSize = 64

    const bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)
  }

  const updateVisualiser = () => {
    if (!dataArray) { return }

    analyser.getByteFrequencyData(dataArray)

    for (let i = 0; i < dataArray.length; i++) {
      line.geometry.vertices[i].y = dataArray[i] / 10
    }

    line.geometry.verticesNeedUpdate = true
  }

  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(handleSuccess)

  /********************/
  /* After initialize */
  /********************/

  /* objects */
  window.line = Floor(scene)
  DirectionLight(scene)
  Skybox(scene)
  const flyCamera = FlyCameraControl(camera)
  scene.fog = new THREE.Fog(0xc20000)

  /* action */
  function action(time, delta) {
    flyCamera(delta)
    updateVisualiser()
    // if (config.showFps) stats.showFps().showMemory()
  }

  !function animate(time, delta = clock.getDelta()) {
    action(time, delta)
    composer.render()
    requestAnimationFrame(animate)
  }()
}

main()

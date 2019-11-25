console.time('Scripts loaded')
import { Player, DirectionLight, Floor, Skybox,
         GunPistol, Boxes, RightHand } from './prefabs/index.js'
import Stats from '../libs/stats.js'
import './index.js'

const main = () => {
  /**************/
  /* Initialize */
  /**************/

  let scene = new THREE.Scene()
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
  // let listener = new THREE.AudioListener()
  // camera.add(listener)
  // scene.add(camera)

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

  globalFunctions.onBlocker = state => {
    // glitchPass.enabled = state
    // hblur.enabled = state
    // vblur.enabled = state
    // filmPass.uniforms.grayscale.value = state
  }

  /********************/
  /* After initialize */
  /********************/

  /* objects */
  Skybox(scene)
  Floor(scene)
  Boxes(scene, 1)
  let player = new Player(camera, scene)
  let directionLight = DirectionLight(scene)

  scene.fog = new THREE.Fog(0xc20000)

  /* music */
  // let audioLoader = new THREE.AudioLoader()
  // let sound = new THREE.Audio(listener)
  // audioLoader.load(assets("music/Tommy - Flyin'.mp3"), buffer => {
  //   sound.setBuffer(buffer)
  //   sound.setLoop(true)
  //   sound.setVolume(config.music / 100)
  //   sound.play()
  // })

  let weapon = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, 5), new THREE.MeshBasicMaterial({ color: 'black' }))
  weapon.position.set(2, -1, -2.5)
  camera.add(weapon)

  // let emitter = new THREE.Object3D()
  // emitter.position.set(2, -1, -5)
  // weapon.add(emitter)

  // let bullets = []
  // let speed = 500

  window.addEventListener("mousedown", () => {
    // let plasmaBall = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 4), new THREE.MeshBasicMaterial({ color: 'orange' }))

    // plasmaBall.position.copy(emitter.getWorldPosition(new THREE.Vector3()))
    // plasmaBall.quaternion.copy(player.getQuaternion())
    // bullets.push(plasmaBall)
    // scene.add(plasmaBall)
  })



    window.raycaster = new THREE.Raycaster();

    // window.addEventListener( 'mousemove', onMouseMove, false );

    window.casterHelper = new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300, 0xff0000)
    scene.add(casterHelper)


  //   var terrain_geometry = makeTile(0.1, 40);
  // var terrain_material = new THREE.MeshLambertMaterial({color: new THREE.Color(0.9, 0.55, 0.4)});
  // var terrain = new THREE.Mesh(terrain_geometry, terrain_material);
  // terrain.position.x = -2;
  // terrain.position.z = -2;
  // terrain.updateMatrixWorld(true);
  // scene.add(terrain);





  let pause = false

  function action(time, delta) {
    if (config.showFps) stats.showFps().showMemory()

      raycaster.setFromCamera(new THREE.Vector3(5000,500,500), camera)
      // var intersects = raycaster.intersectObjects(scene.children)
      // for ( var i = 0; i < intersects.length; i++ ) {
      //   intersects[ i ].object.material.color.set(0xff0000)
      // }

    // bullets.forEach(b => {b.translateZ(-speed * delta)})
    // objects.forEach(box => { box.rotation.y += 0.005 })

    player.control()
  }

  !function animate(time, delta = clock.getDelta()) {
    action(time, delta)
    scene.simulate()
    composer.render()

    if (!pause) requestAnimationFrame(animate)
  }()

  console.timeEnd('Scripts loaded');
}

main()

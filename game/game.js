console.time('Scripts loaded')
import PointerLockControls from '../libs/three/PointerLockControls.js'
import { DirectionLight, Floor, Skybox, DemoAmmo } from './prefabs/index.js'
import { GunPistol, Boxes, RightHand } from './prefabs/index.js'
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
      near: .1,
      z: -20, y: 10, x: -20,
      rotation: { y: 0 }
    },
    frame: {
      elem: document.querySelector('.content'),
      width: () => document.querySelector('.content').offsetWidth,
      height: () => (document.querySelector('.content').offsetHeight - 5)
    }
  }
  let tmpTrans = ''
  let physicsWorld = []
  let rigidBodies = []

  /* camera */
  let camera = new THREE.PerspectiveCamera(
    state.camera.angle,
    state.frame.width() / state.frame.height(),
    state.camera.near,
    state.camera.far
  )
  // let listener = new THREE.AudioListener()
  camera.position.set(state.camera.x, state.camera.y, state.camera.z)
  camera.rotation.y = state.camera.rotation.y
  // camera.add(listener)
  scene.add(camera)

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
  let filmPass = new THREE.FilmPass(1, .2, 648, false)
  composer.addPass(filmPass)

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
  // Skybox(scene, camera)
  let controls = new PointerLockControls(camera)
  let directionLight = DirectionLight(scene)
  Floor(scene)
  objects.push(...Boxes(scene, camera, objects))

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

  /* camera control */

//   function setupPhysicsWorld() {
//     let { gravity } = window.config
//     let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
//         dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
//         overlappingPairCache    = new Ammo.btDbvtBroadphase(),
//         solver                  = new Ammo.btSequentialImpulseConstraintSolver();
//
//     physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
//     physicsWorld.setGravity(new Ammo.btVector3(0, -gravity, 0))
//   }
//
//   function updatePhysics(deltaTime) {
//     physicsWorld.stepSimulation(deltaTime, 10)
//
//     for (let i = 0; i < rigidBodies.length; i++) {
//       let objThree = rigidBodies[i];
//       let objAmmo = objThree.userData.physicsBody;
//       let ms = objAmmo.getMotionState();
//       if (ms) {
//         ms.getWorldTransform(tmpTrans);
//         let p = tmpTrans.getOrigin();
//         let q = tmpTrans.getRotation();
//         objThree.position.set(p.x(), p.y(), p.z());
//         objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
//       }
//     }
//   }

//   Ammo().then(() => {
//     // tmpTrans = new Ammo.btTransform();
//     // setupPhysicsWorld();
//
//     console.log('asd')
//
//
//     /* physics objecst */
//     // DemoAmmo(scene, physicsWorld, rigidBodies)
//   })

  // let colGroupPlane = 1,
  //     colGroupRedBall = 2,
  //     colGroupGreenBall = 4
  //
  // let plasmaBalls = []
  // let bulletsSpeed = 0
  // GunPistol(scene, camera, plasmaBalls, bulletsSpeed)
  // RightHand(scene, camera)

  /* axes */
  if (config.showAxes) {
    objects.forEach(node => {
      const axes = new THREE.AxesHelper()
      axes.material.depthTest = false
      axes.renderOrder = 1
      node.add(axes)
    }
  )}

  let pause = false

  function action(time, delta) {
    if (config.showFps) stats.showFps().showMemory()

    // plasmaBalls.forEach(bullet => {
    //   bullet.translateZ(-bulletsSpeed * delta);
    // });

    // objects.forEach(box => {
    //   box.rotation.y += 0.005
    // })

    controls.control(objects)
  }

  !function animate(time, delta = clock.getDelta()) {
    action(time, delta)
    // updatePhysics(delta);

    composer.render() /* with shaders */
    // renderer.render(scene, camera)
    if (!pause) requestAnimationFrame(animate)
  }()

  console.timeEnd('Scripts loaded');
}

main()

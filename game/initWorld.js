import PointerLockControls from '../libs/three/PointerLockControls.js'
import { DirectionLight, Floor, Skybox, DemoAmmo } from './prefabs/index.js'

let initWorld = function() {
  let scene = new THREE.Scene()
  let objects = []
  let clock = new THREE.Clock()

  //camera
  let camera = function() {
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000)
    camera.position.y = 10
    camera.position.z = -20
    camera.position.x = -20
    camera.rotation.y = Math.PI * 1.25
    return camera
  }()

  //renderer
  let renderer = function() {
    let renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio * window.config.resolutionMultiplier)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMapSoft = true

    renderer.shadowCameraNear = 3
    renderer.shadowCameraFar = camera.far
    renderer.shadowCameraFov = 50

    renderer.shadowMapBias = 0.0039
    renderer.shadowMapDarkness = 0.5
    renderer.shadowMapWidth = 1024
    renderer.shadowMapHeight = 1024

    document.body.appendChild(renderer.domElement)
    return renderer
  }()

  //stats
  let stats = { start: () => {}, end: () => {} }

  if (window.config.debug) {
    stats = function() {
      let stats = new Stats()
      stats.showPanel(0)
      stats.dom.style.cssText = 'position:absolute;bottom:0px;left:0px;'
      document.body.appendChild(stats.dom)

      function start() {stats.begin()}
      function end() {stats.end()}
      return {start, end}
    }()
  }

  //listeners
  !function listeners() {
    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {
      camera.aspect = window.innerWidth/window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    document.getElementById('blocker')
    document.getElementById('instructions')
  }()

  let directionLight = DirectionLight(scene)
  Floor(scene)
  let skyBox = Skybox(scene, camera)

  //camera control
  let controls = function() {
    let controls = new PointerLockControls(camera, skyBox)
    scene.add(controls.getObject())
    return controls
  }()

  //change static properties (from console)
  THREE.globalFunctions.onChangeProperties = (propertyName) => {
    directionLight.shadow.mapSize.width = window.config.shadowResolution
    directionLight.shadow.mapSize.height = window.config.shadowResolution
    directionLight.castShadow = window.config.enableShadows

    //debug: helper
    if (window.config.debug && !scene.getObjectByName('directionLightHelper')) {
      let helper = new THREE.CameraHelper(directionLight.shadow.camera)
      helper.name = 'directionLightHelper'
      scene.add(helper)
    } else if (!window.config.debug) {
      scene.remove(scene.getObjectByName('directionLightHelper'))
    }
  }


  let physicsWorld = []
  let rigidBodies = []
  let tmpTrans = ""

  let setupPhysicsWorld = () => {
    let { gravity } = window.config;
    let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
        dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
        overlappingPairCache    = new Ammo.btDbvtBroadphase(),
        solver                  = new Ammo.btSequentialImpulseConstraintSolver();

    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -gravity, 0));
  }

  let updatePhysics = (deltaTime) => {
    physicsWorld.stepSimulation(deltaTime, 10)

    for (let i = 0; i < rigidBodies.length; i++) {
      let objThree = rigidBodies[i];
      let objAmmo = objThree.userData.physicsBody;
      let ms = objAmmo.getMotionState();
      if (ms) {
        ms.getWorldTransform(tmpTrans);
        let p = tmpTrans.getOrigin();
        let q = tmpTrans.getRotation();
        objThree.position.set(p.x(), p.y(), p.z());
        objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
      }
    }
  }

  Ammo().then(() => {
    tmpTrans = new Ammo.btTransform();
    setupPhysicsWorld();

    // physics objecst
    // DemoAmmo(scene, physicsWorld, rigidBodies)
  })

  return {
    stats, controls, renderer, scene, camera,
    objects, skyBox, light: directionLight, clock,
    tmpTrans, physicsWorld, rigidBodies, updatePhysics
  }
}

export default initWorld

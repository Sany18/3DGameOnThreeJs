// gui:8, camera:13, renderer:23
// directionLight:44 stats:77 listeners:93
// floor:106 skybox:131 controls:148
// onChangeProperties:156 return:172
import PointerLockControls from '../libs/three/PointerLockControls.js'

let initWorld = function() {
  let scene = new THREE.Scene()
  let objects = []
  let clock = new THREE.Clock()

  //gui
  let gui
  // let gui = new dat.GUI()
  // gui.closed = true

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

  //direction light
  let directionLight = function() {
    let light = new THREE.DirectionalLight(0xffffff, 0.7)
    let backLight = new THREE.DirectionalLight(0xffffff, 0.3)

    light.position.set(50, 200, -200)
    backLight.position.set(-50, 200, 200)

    light.target.position.set(0, 0, 0)

    light.castShadow = window.config.enableShadows

    let lightBoxSize = 250
    light.shadow.camera.left = -lightBoxSize
    light.shadow.camera.right = lightBoxSize
    light.shadow.camera.top = lightBoxSize
    light.shadow.camera.bottom = -lightBoxSize
    light.shadow.mapSize.width = window.config.shadowResolution
    light.shadow.mapSize.height = window.config.shadowResolution

    scene.add(light)
    scene.add(backLight)

    let helper = new THREE.CameraHelper(light.shadow.camera)
    helper.name = 'directionLightHelper'

    if (window.config.debug && window.config.helperLight) {
      scene.add(helper)
    }

    return light
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

  //floor
  !function floor() {
    const planeSize = 500
    const texture = THREE.globalFunctions.loadBasicTexture('floorSquere.png')

    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    const repeats = planeSize/2
    texture.repeat.set(repeats, repeats)

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize)
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
    })

    const mesh = new THREE.Mesh(planeGeo, planeMat)
    mesh.receiveShadow = true
    mesh.scale.set(10, 10, 10)
    mesh.rotation.x = Math.PI*-.5

    scene.add(mesh)
  }()

  //skybox
  let skyBox = function() {
    let materialArray = []
    for (let i = 1; i <= 6; i++)
      materialArray.push(new THREE.MeshBasicMaterial({
        map: THREE.globalFunctions.loadBasicTexture('skybox/' + i + '.png'),
        side: THREE.BackSide
    }))

    let skyGeometry = new THREE.CubeGeometry(1000, 1000, 1000)
    let skyMaterial = new THREE.MeshFaceMaterial(materialArray)
    let skyBox = new THREE.Mesh(skyGeometry, skyMaterial)
    skyBox.rotation.y = Math.PI*0.75
    camera.add(skyBox)
    return skyBox
  }()

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

  //vars for actions
  return {
    stats, controls, renderer, scene, camera,
    objects, gui, skyBox, light: directionLight, clock,
    tmpTrans: "", physicsWorld: [], rigidBodies: []
  }
}

export default initWorld

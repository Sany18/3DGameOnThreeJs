import PointerLockControls from '../libs/three/PointerLockControls.js'

let initWorld = function() {
  greeting()

  let objects = [];

  let prevTime = performance.now();
  let vertex = new THREE.Vector3();
  let color = new THREE.Color();

  let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000)
  camera.position.y = 10
  camera.rotation.y = Math.PI * 1.25

  let scene = new THREE.Scene()

  let renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  document.body.appendChild(renderer.domElement)

  // stats
  let stats = new Stats()
  let stats2 = new Stats()
  let stats3 = new Stats()
  stats.showPanel(0)
  stats2.showPanel(1)
  stats3.showPanel(2)
  stats.dom.style.cssText = 'position:absolute;bottom:0px;left:0px;'
  stats2.dom.style.cssText = 'position:absolute;bottom:0px;left:80px;'
  stats3.dom.style.cssText = 'position:absolute;bottom:0px;left:160px;'
  document.body.appendChild(stats.dom)
  document.body.appendChild(stats2.dom)
  document.body.appendChild(stats3.dom)
  stats = [stats, stats2, stats3]

  // gui    
  let gui = new dat.GUI()
  gui.closed = true

  window.addEventListener('resize', onWindowResize, false)
  function onWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  let controls = new PointerLockControls(camera)
  scene.add(controls.getObject())

  let blocker = document.getElementById('blocker')
  let instructions = document.getElementById('instructions')

  // floor
  const loader = new THREE.TextureLoader()
  const planeSize = 100

  // const texture = loader.load('textures/floorSquere.png')

  const texture = loader.load(
    location.origin + '/game/textures/floorSquere.png',
    function (texture) {
      var material = new THREE.MeshBasicMaterial({ map: texture })
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    },
    function (xhr) {
      console.log('An error happened');
    }
  )

  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.NearestFilter
  const repeats = planeSize/2
  texture.repeat.set(repeats, repeats)

  const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
  })

  planeMat.color.setRGB(1.5, 1.5, 1.5)
  const mesh = new THREE.Mesh(planeGeo, planeMat)
  mesh.scale.set(10,10,10)
  mesh.rotation.x = Math.PI * -.5;
  mesh.receiveShadow = true
  scene.add(mesh)

  // objects
  // let boxGeometry = new THREE.BoxBufferGeometry(20, 50, 20)
  // let boxMaterial = new THREE.MeshPhongMaterial({ color: 0xcc0002 })

  // for (let i = 0; i < 50; i++) {
  //   let box = new THREE.Mesh(boxGeometry, boxMaterial)
  //   box.castShadow = true
  //   box.receiveShadow = false

  //   box.position.x = Math.floor(Math.random() * 20 - 10) * 20
  //   box.position.z = Math.floor(Math.random() * 20 - 10) * 20
  //   box.position.y = 2.5

  //   scene.add(box)
  //   objects.push(box)
  // }

  return [
    stats, controls, renderer, scene, camera,
    objects, gui
  ]
}

function greeting() {
  let terminalWidth = 300
  let strs = ['Wake up ', 'alex.t@milestep.io ']
  let substr = ''
  let counter = 0
  let launchChance = 0.01

  function greeting(factor = Math.random()) {
    if (counter == strs.length) return
    let style = `background: #222; color: #0c0; padding: 5px ${terminalWidth}px 23px 8px; font-size: 15px;`
    setTimeout(function() {
      console.clear(); terminalWidth -= 8.4
      console.log(`%c${substr += strs[counter].charAt(substr.length)}█`, style)
      if (strs[counter] == substr) {
        counter++; substr = ''; greeting(5)
      } else greeting()
    }, factor * 500)
  }; if (Math.random() < launchChance) greeting()
}

export default initWorld

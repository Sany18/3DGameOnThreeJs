document.addEventListener('DOMContentLoaded', function() {
  let [
    stats, controls, renderer, scene, camera,
    raycaster, objects, velocity, direction, gui,
    moveForward, moveBackward, moveLeft, moveRight, canJump
  ] = initWorld()

  let clock = new THREE.Clock()

  const state = {
    height: 50
  }

  let light = new THREE.PointLight(0xffffff, 1, 100)
  light.position.set(0, 50, 50)
  light.castShadow = true
  scene.add(light)

  light.shadow.mapSize.width = 512;  // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5;    // default
  light.shadow.camera.far = 500;     // default

  var helper = new THREE.CameraHelper(light.shadow.camera)
  scene.add(helper)

  // http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  gui.add(state, 'height', 0, 100);
  // gui.add(state, 'display');

  function action() {
    light.position.y = state.height
  }

  document.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
      case 38: case 87: moveForward = true; break; // forward
      case 37: case 65: moveLeft = true; break; // left
      case 40: case 83: moveBackward = true; break; // back
      case 39: case 68: moveRight = true; break; //right
      case 32: if (canJump == true) {velocity.y += 350}; canJump = false; break;
    }
  }, false)

  document.addEventListener('keyup', function(e) {
    switch (e.keyCode) {
      case 38: case 87: moveForward = false; break; // forward
      case 37: case 65: moveLeft = false; break; // left
      case 40: case 83: moveBackward = false; break; // back
      case 39: case 68: moveRight = false; break; //right
    }
  }, false)

  !function animate() {
    stats[0].begin(); stats[1].begin(); stats[2].begin()
    requestAnimationFrame(animate)

    action()
    control()

    renderer.render(scene, camera)
    stats[0].end(); stats[1].end(); stats[2].end()
  }()

  function control() {
    if (controls.isLocked === true) {
      raycaster.ray.origin.copy(controls.getObject().position)
      raycaster.ray.origin.y -= 10

      let intersections = raycaster.intersectObjects(objects)
      let onObject = intersections.length > 0
      let delta = clock.getDelta()

      velocity.x -= velocity.x * 10.0 * delta
      velocity.z -= velocity.z * 10.0 * delta
      velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      direction.z = Number(moveForward) - Number(moveBackward)
      direction.x = Number(moveLeft) - Number(moveRight)
      direction.normalize(); // this ensures consistent movements in all directions

      if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta
      if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta
      if (onObject === true) {
        velocity.y = Math.max( 0, velocity.y )
        canJump = true;
      }

      controls.getObject().translateX(velocity.x * delta)
      controls.getObject().position.y += (velocity.y * delta) // new behavior
      controls.getObject().translateZ(velocity.z * delta)

      if (controls.getObject().position.y < 10) {
        velocity.y = 0
        controls.getObject().position.y = 10
        canJump = true
      }
    }
  }

  function initWorld() {
    greeting()

    let objects = [];
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let canJump = false;

    let prevTime = performance.now();
    let velocity = new THREE.Vector3();
    let direction = new THREE.Vector3();
    let vertex = new THREE.Vector3();
    let color = new THREE.Color();

    let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000)
    camera.position.y = 10
    camera.rotation.y = Math.PI * 1.25

    let scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)
    scene.fog = new THREE.Fog(0x000000, 0, 750)

    let renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    document.body.appendChild(renderer.domElement)

    let raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10)

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

    let controls = new THREE.PointerLockControls(camera)
    scene.add(controls.getObject())

    let blocker = document.getElementById('blocker')
    let instructions = document.getElementById('instructions')

    instructions.addEventListener('click', function() {
      controls.lock()
    }, false)

    controls.addEventListener('lock', function() {
      instructions.style.display = 'none'
      blocker.style.display = 'none'
    })

    controls.addEventListener('unlock', function() {
      blocker.style.display = 'block'
      instructions.style.display = ''
    })

    // floor
    const loader = new THREE.TextureLoader()
    const planeSize = 100

    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png')
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
    let boxGeometry = new THREE.BoxBufferGeometry(5, 5, 5)
    let boxMaterial = new THREE.MeshPhongMaterial({ color: 0xcc0002 })

    for (let i = 0; i < 50; i++) {
      let box = new THREE.Mesh(boxGeometry, boxMaterial)
      box.castShadow = true
      box.receiveShadow = false

      box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20
      box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20
      box.position.y = 2.5

      scene.add(box)
      objects.push(box)
    }

    return [
      stats, controls, renderer, scene, camera,
      raycaster, objects, velocity, direction, gui,
      moveForward, moveBackward, moveLeft, moveRight, canJump
    ]
  }

  function greeting() {
    let terminalWidth = 300
    let strs = ['Wake up ', 'alex.t@milestep.io ']
    let substr = ''
    let counter = 0
    let launchChance = 0.1

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
})

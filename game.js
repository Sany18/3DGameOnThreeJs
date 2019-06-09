document.addEventListener('DOMContentLoaded', function() {
  let [scene, camera, renderer, stats] = createScene()

  let cube = makeCube(0xff00ff, -1)
  let cube1 = makeCube(0xff0000, 1)
  let cube2 = makeCube(0xffff00, 0)
  let heart = makeHeart()
  makeGround()

  setLight(50, 100, 100)

  var material2 = new THREE.LineBasicMaterial({ color: 0x00f00ff })
  var geometry2 = new THREE.Geometry()
  geometry2.vertices.push(new THREE.Vector3(-1, 0, 0))
  geometry2.vertices.push(new THREE.Vector3(0, 1, 0))
  var line = new THREE.Line(geometry2, material2)
  scene.add(line)

  let animate = function(time) {
    stats[0].begin(); stats[1].begin(); stats[2].begin()
    time *= 0.001

    action(time)

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera)
    stats[0].end(); stats[1].end(); stats[2].end();
    requestAnimationFrame(animate)
  }; animate()

  function action(time) {
    camera.position.z = 4

    cube.rotation.x = time
    cube1.rotation.y = time

    cube2.rotation.z = time/2
    cube2.rotation.y = time/2
    cube2.rotation.x = time/2

    heart.rotation.z = time/4

  }







  function setLight(x, y, z) {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(x, y, z);
    scene.add(light)
  }

  function makeCube(color, x) {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    const material = new THREE.MeshPhongMaterial({color})
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    cube.position.x = x

    return cube
  }

  function makeHeart() {
    const shape = new THREE.Shape();
    const x = 0;
    const y = 0;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    const extrudeSettings = {
      steps: 2,
      depth: 2,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelSegments: 2,
    }
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 })
    const geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
    const heart = new THREE.Mesh(geometry, material)
    heart.position.z = -10
    scene.add(heart)
    return heart
  }

  function makeGround() {
    const width = 64;
    const height = 64;
    const widthSegments = 2;
    const heightSegments = 2;
    const material = new THREE.MeshPhongMaterial({ color: 0x222222 })
    const geometry = new THREE.PlaneBufferGeometry(width, height, widthSegments, heightSegments);
    const ground = new THREE.Mesh(geometry, material)
    ground.rotation.x = 5
    ground.position.y = -2
    scene.add(ground)
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio;
    const height = canvas.clientHeight * pixelRatio;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function createScene() {
    let scene = new THREE.Scene()
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
    let renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

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

    controls = new THREE.FirstPersonControls(camera, renderer);

    return [scene, camera, renderer, stats]
  }
})

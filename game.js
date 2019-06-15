import './libs/reload.js'
import initWorld from './game/initWorld.js'

document.addEventListener('DOMContentLoaded', function() {
  let [
    stats, controls, renderer, scene, camera,
    objects, gui
  ] = initWorld()

  let light = new THREE.PointLight(0xffffff, 1, 100)
  light.position.set(0, 5, 5)
  light.castShadow = true
  scene.add(light)

  let directionLight = new THREE.DirectionalLight(0xffffff, 1)
  directionLight.position.set(0, 50, -50)
  directionLight.castShadow = true
  scene.add(directionLight)

  light.shadow.mapSize.width = 512;  // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5;    // default
  light.shadow.camera.far = 500;     // default

  // let helper = new THREE.CameraHelper(directionLight.shadow.camera)
  // scene.add(helper)

  // var helper = new THREE.CameraHelper(light.shadow.camera)
  // scene.add(helper)

  // scene.background = new THREE.Color('#bd00b5')
  // scene.fog = new THREE.Fog(0x000000, 0, 750)

  const state = {
    height: 20
  }
  // http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  var f1 = gui.addFolder('PointLight');
  f1.add(state, 'height', 0, 100);



  function action() {
    light.position.y = state.height
  }

  !function animate() {
    stats[0].begin(); stats[1].begin(); stats[2].begin()
    requestAnimationFrame(animate)

    action()
    controls.control(objects) 

    renderer.render(scene, camera)
    stats[0].end(); stats[1].end(); stats[2].end()
  }()
})

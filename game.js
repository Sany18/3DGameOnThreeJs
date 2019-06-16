import './libs/reload.js'
import './game/config.js'
import './game/globalFunctions.js'
import initWorld from './game/initWorld.js'

document.addEventListener('DOMContentLoaded', function() {
  let [
    stats, controls, renderer, scene, camera,
    objects, gui
  ] = initWorld()

  //objects
  !function boxes() {
    let boxGeometry = new THREE.BoxBufferGeometry(20, 20, 20)
    let boxTexture = THREE.globalFunctions.loadBasicTexture('woodBox.png')
    let boxMaterial = new THREE.MeshPhongMaterial({ map: boxTexture })

    for (let i = 0; i < 10; i++) {
      let box = new THREE.Mesh(boxGeometry, boxMaterial)
      box.castShadow = true
      box.receiveShadow = true

      box.position.x = Math.floor(Math.random() * 20 - 10) * 20
      box.position.z = Math.floor(Math.random() * 20 - 10) * 20
      box.position.y = 10

      scene.add(box)
      objects.push(box)
    }
  }()

  // let light = function() {
  //   let light = new THREE.PointLight(0xffffff, 1, 1000)
  //   light.position.set(0, 50, -50)
  //   light.castShadow = true
  //   scene.add(light)

  //   return light
  // }()

  // scene.background = new THREE.Color('#bd00b5')
  // scene.fog = new THREE.Fog(0x000000, 0, 750)

  const state = {
    height: 20
  }
  // http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  var f1 = gui.addFolder('PointLight');
  f1.add(state, 'height', 0, 100);

  function action() {
    // light.position.y = state.height
  }

  !function animate() {
    stats.start()
    requestAnimationFrame(animate)

    action()
    controls.control(objects) 

    renderer.render(scene, camera)
    stats.end()
  }()
})

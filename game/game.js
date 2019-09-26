import '../config.js'
import initWorld from './initWorld.js'
import './globalFunctions.js'
import './extra/other.js'
import './extra/console.js'
import './extra/wsChat.js'
import '../libs/reload.js'
import '../libs/three/OBJLoader.js'
import { GunPistol, Boxes } from './prefabs/index.js'

document.addEventListener('DOMContentLoaded', main)

function main() {
  console.time('Scripts loaded');

  let {
    stats, controls, renderer, scene, camera,
    objects, skyBox, light, clock, tmpTrans,
    physicsWorld, rigidBodies, updatePhysics
  } = initWorld()

  let colGroupPlane = 1,
      colGroupRedBall = 2,
      colGroupGreenBall = 4
  
  let plasmaBalls = []
  let bulletsSpeed = 0
  GunPistol(scene, camera, plasmaBalls, bulletsSpeed)
  Boxes(scene, camera, objects)

  //axes
  if (window.config.showAxes) objects.forEach((node) => {
    const axes = new THREE.AxesHelper()
    axes.material.depthTest = false
    axes.renderOrder = 1
    node.add(axes)
  })

  function action(time, delta) {
    light.position.y = 20

    plasmaBalls.forEach(bullet => {
      bullet.translateZ(-bulletsSpeed * delta);
    });
  }

  !function animate(time) {
    let deltaTime = clock.getDelta();
    stats.start()

    action(time, deltaTime)
    controls.control(objects)
    updatePhysics(deltaTime);

    renderer.render(scene, camera)
    stats.end()
    requestAnimationFrame(animate)
  }()

  console.timeEnd('Scripts loaded');
}

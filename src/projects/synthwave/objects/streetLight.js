import * as THREE from 'three'

export default (scene, offsetX = 0) => {
  const stickGeometry = new THREE.BoxBufferGeometry(.05, 2, .05)
  const stickMaterial = new THREE.MeshPhongMaterial({ color: 'grey' })
  const stick = new THREE.Mesh(stickGeometry, stickMaterial, 0)
  stick.position.set(1, 0, offsetX)

  const stickGeometry2 = new THREE.BoxBufferGeometry(.05, .7, .05)
  const stick2 = new THREE.Mesh(stickGeometry2, stickMaterial, 0)
  stick.add(stick2)
  stick2.position.set(-.283, 1.168, 0)
  stick2.rotation.z = 1

  const stickGeometry3 = new THREE.BoxBufferGeometry(.07, .07, .07)
  const stick3 = new THREE.Mesh(stickGeometry3, stickMaterial, 0)
  stick3.rotation.z = Math.PI * .5
  stick.add(stick3)

  const stickGeometry4 = new THREE.BoxBufferGeometry(.04, .13, .07)
  const stick4 = new THREE.Mesh(stickGeometry4, stickMaterial, 0)
  stick4.position.set(-.6, 1.33, 0)
  stick4.rotation.z = Math.PI * .4
  stick.add(stick4)

  const light = new THREE.PointLight(0xf79328, 1.337, 10)
  light.position.set(-.62, 1.28, 0)
  light.rotation.set(Math.PI * -.5, Math.PI * .1, 0)
  stick.add(light)

  // const helper = new THREE.CameraHelper(light.shadow.camera)
  // light.add(helper)

  stick.name = 'street_light'
  scene.add(stick)
  return stick
}

import * as THREE from 'three'

const importAll = folder => folder.keys().map(folder)
const BillBoardImage = importAll(require.context('../assets/textures/billboards', false, /\.(png|jpe?g|svg)$/))

export default (scene, offsetX = 0) => {
  /* frame */
  const stickGeometry = new THREE.CylinderGeometry(.025, .025, .6)
  const stickMaterial = new THREE.MeshPhongMaterial({ color: 0x383838, shininess: 150 })
  const stick = new THREE.Mesh(stickGeometry, stickMaterial, 0)
  stick.position.set(-2, .3, offsetX)
  stick.rotation.y = .2

  const stickGeometry2 = new THREE.BoxBufferGeometry(.02, 1, .05)
  const stick2 = new THREE.Mesh(stickGeometry2, stickMaterial, 0)
  stick.add(stick2)
  stick2.position.set(0, .3, 0)
  stick2.rotation.z = Math.PI * .5

  const stick3 = new THREE.Mesh(stickGeometry2, stickMaterial, 0)
  stick.add(stick3)
  stick3.position.set(0, .8, 0)
  stick3.rotation.z = Math.PI * .5

  const foundationGeometry = new THREE.BoxBufferGeometry(.3, .1, .3)
  const foundation = new THREE.Mesh(foundationGeometry, stickMaterial, 0)
  foundation.position.set(0, -.32, 0)
  foundation.rotation.set(0, -.2, 0)
  stick.add(foundation)

  /* image */
  const texture = new THREE.TextureLoader().load(BillBoardImage[window.randInt(20)])
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 1)
  const planeGeometry = new THREE.PlaneGeometry(1, .5, .3)
  const planeMaterial = new THREE.MeshPhongMaterial({ map: texture, color: 'white', side: THREE.DoubleSide })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial, 0)
  plane.position.set(0, .55, 0)
  stick.add(plane)

  /* lightsticks */
  const lightStickGeometry = new THREE.BoxBufferGeometry(.01, .01, .3)
  const lightStickMaterial = new THREE.MeshPhongMaterial({ color: 0x262626, shininess: 150 })
  const lightStick = new THREE.Mesh(lightStickGeometry, lightStickMaterial, 0)
  lightStick.position.set(-.33, .84, .16)
  lightStick.rotation.x = -.25
  lightStick.rotation.y = -.25
  stick.add(lightStick)

  const lightStick2 = new THREE.Mesh(lightStickGeometry, lightStickMaterial, 0)
  lightStick2.position.set(.33, .84, .16)
  lightStick2.rotation.x = -.25
  lightStick2.rotation.y = .25
  stick.add(lightStick2)

  const lampGeometry = new THREE.BoxBufferGeometry(.02, .01, .02)
  const lamp = new THREE.Mesh(lampGeometry, lightStickMaterial, 0)
  lamp.position.set(.366, .87, .3)
  lamp.rotation.set(.5, .25, -.25)
  stick.add(lamp)

  const lamp2 = new THREE.Mesh(lampGeometry, lightStickMaterial, 0)
  lamp2.position.set(-.366, .87, .3)
  lamp2.rotation.set(.5, -.25, .25)
  stick.add(lamp2)

  /* lights */
  const light = new THREE.PointLight(0xffffff, .5, 5)
  light.position.set(-.366, .87, .3)
  light.rotation.set(-1, -.5, 0)
  stick.add(light)
  // const helper = new THREE.CameraHelper(light.shadow.camera)
  // light.add(helper)

  const light2 = new THREE.PointLight(0xffffff, .5, 5)
  light2.position.set(.366, .87, .3)
  light2.rotation.set(-1, .5, 0)
  stick.add(light2)
  // const helper2 = new THREE.CameraHelper(light2.shadow.camera)
  // light2.add(helper2)

  stick.name = 'billboard'
  scene.add(stick)
  return stick
}

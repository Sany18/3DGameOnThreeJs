import * as THREE from 'three'

export default (scene, camera) => {
  let state = {
    position: { x: 0, y: 50, z: 0 },
    size: 300,
    // color: 0xfa880f
    color: 0xffffff
  }
  let light = new THREE.DirectionalLight(state.color, 1.3)
  let backLight = new THREE.DirectionalLight(state.color, 0.5)

  light.position.set(state.position.x, state.position.y, state.position.z)
  backLight.position.set(-state.position.x, state.position.y, -state.position.z)
  light.target.position.set(0, 0, 0)

  // if (config.castShadow) {
  //   light.castShadow = config.enableShadows
  //   light.shadow.camera.left = -state.size
  //   light.shadow.camera.right = state.size
  //   light.shadow.camera.top = state.size
  //   light.shadow.camera.bottom = -state.size
  //   light.shadow.mapSize.width = config.shadowResolution
  //   light.shadow.mapSize.height = config.shadowResolution
  // }

  // if (config.helperLight) {
//     let helper = new THREE.CameraHelper(light.shadow.camera)
// 
//     helper.name = 'directionLightHelper'
//     scene.add(helper)
  // }
  
  scene.add(light)
  scene.add(backLight)

  return light
}

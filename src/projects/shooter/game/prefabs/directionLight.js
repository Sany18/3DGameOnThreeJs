import * as THREE from 'three'

export default (scene, camera) => {
  let light = new THREE.DirectionalLight(0xffffff, 1.3)
  let backLight = new THREE.DirectionalLight(0xffffff, 0.5)
  let lightBoxSize = 250
  let state = {
    position: { x: 50, y: 200, z: -200 },
    size: 250,
    castShadow: false,
    enableShadows: false,
    shadowResolution: 2048,
    helperLight: false
  }

  light.position.set(state.position.x, state.position.y, state.position.z)
  backLight.position.set(-state.position.x, state.position.y, -state.position.z)
  light.target.position.set(0, 0, 0)

  if (state.castShadow) {
    light.castShadow = state.enableShadows
    light.shadow.camera.left = -state.size
    light.shadow.camera.right = state.size
    light.shadow.camera.top = state.size
    light.shadow.camera.bottom = -state.size
    light.shadow.mapSize.width = state.shadowResolution
    light.shadow.mapSize.height = state.shadowResolution
  }

  if (state.helperLight) {
    let helper = new THREE.CameraHelper(light.shadow.camera)

    helper.name = 'directionLightHelper'
    scene.add(helper)
  }
  
  scene.add(light)
  scene.add(backLight)

  return light
}

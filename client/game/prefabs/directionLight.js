export default (scene, camera) => {
  let light = new THREE.DirectionalLight(0xffffff, 1.3)
  let backLight = new THREE.DirectionalLight(0xffffff, 0.5)
  let lightBoxSize = 250
  let state = {
    position: { x: 50, y: 200, z: -200 },
    size: 250
  }

  light.position.set(state.position.x, state.position.y, state.position.z)
  backLight.position.set(-state.position.x, state.position.y, -state.position.z)
  light.target.position.set(0, 0, 0)

  if (config.castShadow) {
    light.castShadow = config.enableShadows
    light.shadow.camera.left = -state.size
    light.shadow.camera.right = state.size
    light.shadow.camera.top = state.size
    light.shadow.camera.bottom = -state.size
    light.shadow.mapSize.width = config.shadowResolution
    light.shadow.mapSize.height = config.shadowResolution
  }

  if (config.helperLight) {
    let helper = new THREE.CameraHelper(light.shadow.camera)

    helper.name = 'directionLightHelper'
    scene.add(helper)
  }
  
  scene.add(light)
  scene.add(backLight)

  return light
}

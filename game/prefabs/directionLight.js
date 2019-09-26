let DirectionLight = (scene, camera) => {
  let light = new THREE.DirectionalLight(0xffffff, 0.7)
  let backLight = new THREE.DirectionalLight(0xffffff, 0.3)

  light.position.set(50, 200, -200)
  backLight.position.set(-50, 200, 200)

  light.target.position.set(0, 0, 0)

  light.castShadow = window.config.enableShadows

  let lightBoxSize = 250
  light.shadow.camera.left = -lightBoxSize
  light.shadow.camera.right = lightBoxSize
  light.shadow.camera.top = lightBoxSize
  light.shadow.camera.bottom = -lightBoxSize
  light.shadow.mapSize.width = window.config.shadowResolution
  light.shadow.mapSize.height = window.config.shadowResolution

  scene.add(light)
  scene.add(backLight)

  let helper = new THREE.CameraHelper(light.shadow.camera)
  helper.name = 'directionLightHelper'

  if (window.config.debug && window.config.helperLight) {
    scene.add(helper)
  }

  return light
}

export default DirectionLight

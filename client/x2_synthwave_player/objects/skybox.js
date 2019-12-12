export default scene => {
  scene.background = new THREE.CubeTextureLoader().load(
    Array(6).fill().map((_, i) =>
      origin + '/x2_synthwave_player/assets/textures/skybox/' + (i + 1) + '.jpg'
    )
  )
}

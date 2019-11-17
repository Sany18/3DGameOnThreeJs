export default (scene, camera) => {
  const loader = new THREE.CubeTextureLoader()
  const texture = loader.load(
    Array(6).fill().map((_, i) => 
      config.imagePrefix + 'skybox-space-2/' + (i + 1) + '.png'
    )
  )

  scene.background = texture
}

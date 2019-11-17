export default (scene, camera) => {
  const state = {
    planeSize: 200,
    scale: 20,
    wireframe: true
  }

  // const texture = globalFunctions.loadBasicTexture('skybox/4.png')
  const repeats = state.planeSize / 16
  const geometry = new THREE.PlaneBufferGeometry(state.planeSize, state.planeSize, state.planeSize, state.planeSize)
  const material = new THREE.MeshBasicMaterial({ color: 0x6A0055, wireframe: state.wireframe, opacity: 0.5 });
  const mesh = new THREE.Mesh(geometry, material)

  // texture.wrapS = THREE.RepeatWrapping
  // texture.wrapT = THREE.RepeatWrapping
  // texture.magFilter = THREE.NearestFilter
  // texture.repeat.set(repeats, repeats)
  // texture.scale = 5

  mesh.receiveShadow = true
  mesh.scale.set(state.scale, state.scale, state.scale)
  mesh.rotation.x = Math.PI * -.5

  scene.add(mesh)

  return mesh
}

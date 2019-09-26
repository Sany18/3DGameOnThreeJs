let Floor = (scene, camera) => {
  const planeSize = 500
  const texture = THREE.globalFunctions.loadBasicTexture('floorSquere.png')

  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.NearestFilter
  const repeats = planeSize/2
  texture.repeat.set(repeats, repeats)

  const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize)
  const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
  })

  const mesh = new THREE.Mesh(planeGeo, planeMat)
  mesh.receiveShadow = true
  mesh.scale.set(10, 10, 10)
  mesh.rotation.x = Math.PI*-.5

  scene.add(mesh)
}

export default Floor

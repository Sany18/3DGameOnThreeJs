let Skybox = (scene, camera) => {
  let materialArray = []
  for (let i = 1; i <= 6; i++)
    materialArray.push(new THREE.MeshBasicMaterial({
      map: THREE.globalFunctions.loadBasicTexture('skybox/' + i + '.png'),
      side: THREE.BackSide
  }))

  let skyGeometry = new THREE.CubeGeometry(1000, 1000, 1000)
  let skyMaterial = new THREE.MeshFaceMaterial(materialArray)
  let skyBox = new THREE.Mesh(skyGeometry, skyMaterial)
  skyBox.rotation.y = Math.PI*0.75
  camera.add(skyBox)
  return skyBox
}

export default Skybox

export default (scene, camera, rotationY = 0) => {
  let materialArray = []
  let skyGeometry = new THREE.CubeGeometry(1000, 1000, 1000)
  // let skyMaterial = new THREE.MeshFaceMaterial(materialArray)
   let skyMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide })
  let skyBox = new THREE.Mesh(skyGeometry, skyMaterial)

   for (let i = 1; i <= 6; i++)
     materialArray.push(new THREE.MeshBasicMaterial({
       map: THREE.globalFunctions.loadBasicTexture('skybox-red-space/' + i + '.jpg'),
       side: THREE.BackSide
   }))

  skyBox.rotation.y = rotationY
  camera.add(skyBox)

  return skyBox
}

let Boxes = (scene, camera, objects) => {
  let boxGeometry = new THREE.BoxBufferGeometry(20, 20, 20)
  let boxTexture = THREE.globalFunctions.loadBasicTexture('woodBox.png')
  let boxMaterial = new THREE.MeshPhongMaterial({ map: boxTexture })

  for (let i = 0; i < 10; i++) {
    let box = new THREE.Mesh(boxGeometry, boxMaterial)
    box.castShadow = true
    box.receiveShadow = true

    box.position.x = Math.floor(Math.random() * 20 - 10) * 20
    box.position.z = Math.floor(Math.random() * 20 - 10) * 20
    box.position.y = 10

    box.collision = new THREE.Box3().setFromObject(box);

    scene.add(box)
    objects.push(box)
  }
}

export default Boxes

export default (scene, amount = 5) => {
  let boxGeometry = new THREE.BoxBufferGeometry(20, 20, 20)
  let boxTexture = THREE.loadBasicTexture('woodBox.png')
  let boxMaterial = new THREE.MeshPhongMaterial({ map: boxTexture })
  // let boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, opacity: 1 });

  const createCube = (counter = 0) => {
    if (counter < amount) {
      let box = new Physijs.BoxMesh(boxGeometry, boxMaterial, 1)
      box.castShadow = true
      box.receiveShadow = true

      box.position.x = Math.floor(Math.random() * 20 - 10) * 5
      box.position.z = Math.floor(Math.random() * 20 - 10) * 5
      box.position.y = 100
      box.rotation.x = Math.random() * 2
      box.rotation.y = Math.random() * 2
      box.rotation.z = Math.random() * 2

      scene.add(box)

      setTimeout(() => createCube(counter + 1), 500)
    }
  }

  setTimeout(createCube, 2500)
}

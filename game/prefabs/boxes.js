export default (scene, camera) => {
  let objects = []
  let boxGeometry = new THREE.BoxBufferGeometry(20, 20, 20)
  // let boxTexture = globalFunctions.loadBasicTexture('woodBox.png')
  // let boxMaterial = new THREE.MeshPhongMaterial({ map: boxTexture })
  let boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, opacity: 1 });

  for (let i = 0; i < 100; i++) {
    let box = new THREE.Mesh(boxGeometry, boxMaterial)
    box.castShadow = true
    box.receiveShadow = true

    box.position.x = Math.floor(Math.random() * 20 - 10) * 20
    box.position.z = Math.floor(Math.random() * 20 - 10) * 20
    box.position.y = Math.floor(Math.random() * 20 - 10) * 20

    box.collision = new THREE.Box3().setFromObject(box);

    scene.add(box)
    objects.push(box)
  }

  return objects
}

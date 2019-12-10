export default (scene, amount = 5) => {
  const positions = [
    { x: 0, y: 5, z: 7, r: { x: 0, y: 0, z: 0 } },
    { x: -20, y: 5, z: 20, r: { x: 0, y: Math.PI / 8, z: 0 } },
  ]

  let boxGeometry = new THREE.BoxBufferGeometry(10, 10, 10)
  let boxTexture = THREE.loadBasicTexture('woodBox.png')
  let boxMaterial = new THREE.MeshPhongMaterial({ map: boxTexture })

  positions.forEach(i => {
    let box = new Physijs.BoxMesh(boxGeometry, boxMaterial, 0)
    box.castShadow = true
    box.receiveShadow = true
    box.name = 'box'

    box.position.set(i.x, i.y, i.z)
    box.rotation.set(i.r.x, i.r.y, i.r.z)

    scene.add(box)
  })
}

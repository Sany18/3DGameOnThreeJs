export default scene => {
  const positions = [
    { x: 0, y: 10, z: 0, r: { x: 0, y: 0, z: 0 } },
    { x: 20, y: 10, z: 0, r: { x: 0, y: 0, z: 0 } },
    { x: 40, y: 10, z: 0, r: { x: 0, y: 0, z: 0 } },
    { x: 20, y: 20, z: 10, r: { x: Math.PI / 2, y: 0, z: 0 } },
    { x: 40, y: 20, z: 10, r: { x: Math.PI / 2, y: 0, z: 0 } },
    { x: 40, y: 20, z: 30, r: { x: Math.PI / 2, y: 0, z: 0 } },
    { x: 60, y: 25, z: 30, r: { x: Math.PI / 2, y: Math.PI / 8, z: 0 } }
  ]

  let boxGeometry = new THREE.BoxBufferGeometry(20, 20, 4)
  let boxTexture = THREE.loadBasicTexture('skybox/4.png')
  let boxMaterial = new THREE.MeshPhongMaterial({ map: boxTexture })
  // let boxMaterial = new THREE.MeshBasicMaterial({ color: 0x123123, wireframe: false, opacity: 1 })

  positions.forEach(i => {
    let box = new Physijs.BoxMesh(boxGeometry, boxMaterial, 0)
    box.castShadow = true
    box.receiveShadow = true
    box.name = 'wall'

    box.position.set(i.x, i.y, i.z)
    box.rotation.set(i.r.x, i.r.y, i.r.z)

    scene.add(box)
  })
}

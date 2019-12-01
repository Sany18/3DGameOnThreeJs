export default class {
  constructor(scene, id) {
    let boxGeometry = new THREE.BoxBufferGeometry(10, 20, 5)
    let boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, opacity: 1 })
    let somePlayer = new THREE.Mesh(boxGeometry, boxMaterial)

    somePlayer.position.x = -100
    somePlayer.position.z = -100
    somePlayer.position.y = 10
    somePlayer.name = 'realPlayer'
    somePlayer.networkId = id

    scene.add(somePlayer)
    return somePlayer
  }
}

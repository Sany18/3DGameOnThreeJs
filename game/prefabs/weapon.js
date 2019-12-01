export default camera => {
  let weapon = new THREE.Mesh(
    new THREE.BoxGeometry(.5, .5, 5),
    new THREE.MeshBasicMaterial({ color: 'black' })
  )

  weapon.position.set(2, -1, -2.5)
  camera.add(weapon)

  return weapon
}

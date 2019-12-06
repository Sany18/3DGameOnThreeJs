export default (camera, listener) => {
  let weapon = new THREE.Mesh(
    new THREE.BoxGeometry(.5, .5, 5),
    new THREE.MeshBasicMaterial({ color: 'black' })
  )

  let sound = new THREE.Audio(listener)
  let audioLoader = new THREE.AudioLoader()
  audioLoader.load(assets('sounds/shotgun-shot.ogg'), buffer => {
    sound.setBuffer(buffer)
    sound.setVolume(config.volume * 0.01 / 1.5)
  })

  weapon.sound = sound
  weapon.position.set(2, -1, -2.5)
  camera.add(weapon)

  return weapon
}

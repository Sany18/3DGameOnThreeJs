import * as THREE from 'three'
import RoadTexture from '../assets/textures/road.png'

export default scene => {
  const state = {
    repeatTexture: 100,
    size: 2
  }

  const texture = new THREE.TextureLoader().load(RoadTexture)
  texture.wrapT = THREE.RepeatWrapping
  texture.minFilter = THREE.LinearFilter
  texture.repeat.set(1, state.repeatTexture)

  const material = new THREE.MeshPhongMaterial({ map: texture, envMap: scene.background, combine: THREE.MixOperation, reflectivity: .1, roughness: 0 })
  const geometry = new THREE.PlaneGeometry(state.size, state.repeatTexture)

  const plane = new THREE.Mesh(geometry, material)
  plane.rotation.x = -Math.PI / 2
  plane.position.set(0, .001, -20)

  scene.add(plane)
  return texture
}

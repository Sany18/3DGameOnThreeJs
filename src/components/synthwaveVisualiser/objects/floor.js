import * as THREE from 'three'
import FloorMesh from '../assets/textures/floor-mesh.png'

export default scene => {
  const state = {
    repeatTexture: 1000,
    size: 1000
  }

  const texture = new THREE.TextureLoader().load(FloorMesh)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(state.repeatTexture, state.repeatTexture)

  const material = new THREE.MeshLambertMaterial({ map: texture, envMap: scene.background, combine: THREE.MixOperation, reflectivity: .5 })
  const geometry = new THREE.PlaneGeometry(state.size, state.size)

  const plane = new THREE.Mesh(geometry, material)
  plane.rotation.x = -Math.PI / 2
  plane.position.set(.5, 0, 20.5)

  scene.add(plane)
  return texture
}

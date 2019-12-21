import * as THREE from 'three'
import FloorMesh from '../assets/textures/floor-mesh.png'

export default scene => {
  const state = {
    repeatTexture: 100,
    size: 100
  }

  const texture = new THREE.TextureLoader().load(FloorMesh)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(state.repeatTexture, state.repeatTexture)

  const material = new THREE.MeshBasicMaterial({ map: texture, envMap: scene.background })

  // material.envMaps = scene.background
  const geometry = new THREE.PlaneGeometry(state.size, state.size)

  const plane = new THREE.Mesh(geometry, material)
  plane.rotation.x = -Math.PI / 2

  // plane.envMaps(texture)
  window.a = scene

  scene.add(plane)
}

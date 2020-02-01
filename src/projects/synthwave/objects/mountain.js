import * as THREE from 'three'
import FloorMesh from '../assets/textures/floor-mesh.png'

export default (scene, offsetX = 0, offsetZ = 0) => {
  const width = 4
  const height = 2

  const texture = new THREE.TextureLoader().load(FloorMesh)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(width, height)

  const geometry = new THREE.PlaneGeometry(width, height, width, height)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const plane = new THREE.Mesh(geometry, material)
  const centralVertex = Math.round(((width+1) * (height+1)) / 2) - 1

  plane.position.set(offsetX, 0, offsetZ)
  plane.rotation.x = Math.PI * -.5
  scene.add(plane)

  plane.updateMountainHeight = newHeight => {
    geometry.vertices[centralVertex].z = Math.sqrt(newHeight)
    geometry.vertices[centralVertex-1].z = Math.sqrt(newHeight/2)
    geometry.vertices[centralVertex+1].z = Math.sqrt(newHeight/2)
    // geometry.vertices[centralVertex + width + 1].z = Math.sqrt(newHeight/2)
    // geometry.vertices[centralVertex - width - 1].z = Math.sqrt(newHeight/2)
    geometry.verticesNeedUpdate = true
  }

  return plane
}

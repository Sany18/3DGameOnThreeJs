import * as THREE from 'three'

export default scene => {
  const state = { points: 32 }

  const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
  const geometry = new THREE.Geometry()

  for (let i = 0; i < state.points; i++) {
    geometry.vertices.push(new THREE.Vector3(-16 + i, 1, 0))
  }

  const line = new THREE.Line(geometry, material)
  scene.add(line)

  return line
}

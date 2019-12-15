import * as THREE from 'three'

export default (scene, camera) => {
  const state = {
    planeSize: 400,
    repeats: 100,
    scale: 20,
    wireframe: true,
    points: 32
  }

  const leftGrid = new THREE.GridHelper(state.planeSize, state.repeats, 0x6A0055, 0x6A0055)
  leftGrid.position.x = -state.planeSize / 2 - 5
  leftGrid.position.z = -state.planeSize / 2 + 20
  scene.add(leftGrid)

  const rightGrid = new THREE.GridHelper(state.planeSize, state.repeats, 0x6A0055, 0x6A0055)
  rightGrid.position.x = state.planeSize / 2 + 5
  rightGrid.position.z = -state.planeSize / 2 + 20
  scene.add(rightGrid)


  const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
  const geometry = new THREE.Geometry()

  for (let i = 0; i < state.points; i++) {
    geometry.vertices.push(new THREE.Vector3(-16 + i, 1, 0))
  }

  const line = new THREE.Line(geometry, material)
  scene.add(line)

  return line
}

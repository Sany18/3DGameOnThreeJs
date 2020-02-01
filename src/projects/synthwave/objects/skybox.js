import * as THREE from 'three'
import * as Textures from '../assets/textures/skybox'

export default scene => {
  scene.background = new THREE.CubeTextureLoader().load(
    Array(6).fill().map((_, i) => Textures['T' + (i + 1)])
  )
}

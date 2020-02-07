import * as THREE from 'three'

export default scene => {
  scene.background = new THREE.CubeTextureLoader().load(
    Array(6).fill().map((_, i) => 
      require('../../assets/textures/skybox-space-2/' + (i + 1) + '.png')
    )
  )
}

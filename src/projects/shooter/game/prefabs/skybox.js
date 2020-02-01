import * as THREE from 'three'

export default scene => {
  scene.background = new THREE.CubeTextureLoader().load(
    Array(6).fill().map((_, i) => 
      config.imagePrefix + 'skybox-space-2/' + (i + 1) + '.png'
    )
  )
}

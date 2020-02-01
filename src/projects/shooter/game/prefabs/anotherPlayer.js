import * as THREE from 'three'

export default class {
  constructor(scene, id, name) {
    function makeLabelCanvas(width = 256, height = 64) {
      const ctx = document.createElement('canvas').getContext('2d')
      const font = `${height}px bold sans-serif`
      const textWidth = ctx.measureText(name || id).width

      ctx.canvas.width = width
      ctx.canvas.height = height
      ctx.font = font
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'

      const scaleFactor = Math.min(1, width / textWidth)
      ctx.translate(width / 2, height / 2)
      ctx.scale(scaleFactor, 1)
      ctx.fillStyle = 'white'
      ctx.fillText(name || id, 0, 0)

      return ctx.canvas
    }

    const boxGeometry = new THREE.BoxBufferGeometry(5, 10, 2.5)
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, opacity: 1 })
    const somePlayer = new THREE.Mesh(boxGeometry, boxMaterial)

    somePlayer.position.x = -20
    somePlayer.position.z = -80
    somePlayer.position.y = 5.1
    somePlayer.name = 'realPlayer'
    somePlayer.networkId = id

    const canvas = makeLabelCanvas()
    const labelBaseScale = 0.02
    const texture = new THREE.CanvasTexture(canvas)
    const labelMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true })
    const label = new THREE.Sprite(labelMaterial)

    if (config.showNamesOverPlayer) somePlayer.add(label)
    label.position.y = somePlayer.position.y + 5

    label.scale.x = canvas.width * labelBaseScale
    label.scale.y = canvas.height * labelBaseScale

    scene.add(somePlayer)
    return somePlayer
  }
}

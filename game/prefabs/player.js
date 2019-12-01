export default class Player {
  constructor(camera, scene) {
    this.camera = camera
    this.scene = scene
    this.body = this.createPlayerModel()
    this.connect()
  }

  /*get*/
  jumpHeight = new THREE.Vector3(0, config.jumpHeight, 0)
  moveForward = false
  moveBackward = false
  moveLeft = false
  moveRight = false
  rotationRight = false
  rotationLeft = false
  canJump = false
  crouch = false

  clock = new THREE.Clock()
  velocity = new THREE.Vector3()
  direction = new THREE.Vector3()
  vectorX1 = new THREE.Vector3(0, 1, 0)

  control = (delta = this.clock.getDelta()) => {
    if (document.pointerLockElement) {
      this.velocity.x -= this.velocity.x * 10.0 * delta
      this.velocity.z -= this.velocity.z * 10.0 * delta

      this.direction.z = +this.moveForward - +this.moveBackward
      this.direction.x = +this.moveLeft - +this.moveRight

      if (this.moveForward || this.moveBackward) {
        this.velocity.z -= this.direction.z * config.moveSpeed * 5 * delta }
      if (this.moveLeft || this.moveRight) {
        this.velocity.x -= this.direction.x * config.moveSpeed * 5 * delta }
      if (this.body._physijs.touches.length != 0 && this.canJump) {
        this.body.applyCentralImpulse(this.jumpHeight)
        this.canJump = false }
      if (this.rotationLeft) { this.body.rotateOnAxis(this.vectorX1, 0.04) }
      if (this.rotationRight) { this.body.rotateOnAxis(this.vectorX1, -0.04) }

      this.body.__dirtyPosition = true
      this.body.__dirtyRotation = true
      this.body.translateX(this.velocity.x * delta)
      this.body.translateZ(this.velocity.z * delta)
    }
  }

  eulerX = new THREE.Euler(0, 0, 0, 'YXZ')
  eulerY = new THREE.Euler(0, 0, 0, 'YXZ')
  euler = new THREE.Euler(0, 0, 0, 'YXZ')
  quaternion = new THREE.Quaternion()

  onMouseMove = event => {
    if (!document.pointerLockElement) return

    let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
    let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0

    this.eulerY.y -= movementX * 0.002
    this.eulerX.x -= movementY * 0.002
    this.eulerX.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.eulerX.x))

    this.camera.quaternion.setFromEuler(this.eulerX)
    this.body.quaternion.setFromEuler(this.eulerY)
    this.body.__dirtyRotation = true

    this.euler.y = this.eulerY.y
    this.euler.x = this.eulerX.x
    this.quaternion.setFromEuler(this.euler)
  }

  canJumpAgain = true

  jump = () => {
    if (!this.canJumpAgain) { this.canJump = false; return }

    this.canJump = true
    this.canJumpAgain = false
    setTimeout(() => { this.canJumpAgain = true }, 100)
  }

  createPlayerModel = () => {
    let boxGeometry = new THREE.BoxBufferGeometry(5, 10, 2.5)
    let boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, opacity: 1 })
    let body = new Physijs.BoxMesh(boxGeometry, boxMaterial, config.yourMass)

    body.castShadow = true
    body.receiveShadow = true
    body.position.x = 50
    body.position.z = 50
    body.position.y = 6
    body.name = 'realPlayer'
    body.addEventListener('ready', () => {
      body.setAngularFactor(new THREE.Vector3(0, 0, 0))
    })

    body.add(this.camera)
    this.scene.add(body)
    this.camera.position.set(0, 7.5, -2.5)
    this.camera.add(this.crosshair())

    return body
  }

  crosshair = () => {
    let size = .002
    let geometry = new THREE.Geometry()
    let material = new THREE.LineBasicMaterial({ color: 'white' })
    geometry.vertices.push(
      new THREE.Vector3(0, size, -.1),
      new THREE.Vector3(size, 0, -.1),
      new THREE.Vector3(0, -size, -.1),
      new THREE.Vector3(-size, 0, -.1),
      new THREE.Vector3(0, size, -.1)
    )

    let crosshair = new THREE.Line(geometry, material)
    return crosshair
  }

  keydown = event => {
    switch (event.keyCode) {
      case 38: case 87: this.moveForward = true; break;  // W forward
      case 40: case 83: this.moveBackward = true; break; // S back
      case 37: case 65: this.moveLeft = true; break;     // A left
      case 39: case 68: this.moveRight = true; break;    // D right
      case 81: this.rotationLeft = true; break;          // Q rotation left
      case 69: this.rotationRight = true; break;         // E rotation right
      case 17: this.crouch = true; break;                // Ctrl crouch
      case 32: this.jump(); break;                       // Space jump
    }
  }

  keyup = event => {
    switch (event.keyCode) {
      case 38: case 87: this.moveForward = false; break;  // forward
      case 40: case 83: this.moveBackward = false; break; // back
      case 37: case 65: this.moveLeft = false; break;     // left
      case 39: case 68: this.moveRight = false; break;    // right
      case 81: this.rotationLeft = false; break;          // rotation left
      case 69: this.rotationRight = false; break;         // rotation right
      case 17: this.crouch = false; break;                // crouch
      case 32: this.canJump = false; break;               // jump
    }
  }

  blocker = event => {
    if (event.target.id == 'menu-button') {
      console.log('Menu...')
    } else {
      document.pointerLockElement
        ? document.exitPointerLock()
        : document.body.requestPointerLock()
    }
  }

  pointerlockchange = () => {
    this.moveForward = this.moveBackward = this.moveLeft = this.moveRight = this.canJump = false
    document.getElementById('blocker').style.display = document.pointerLockElement ? 'none' : 'flex'
    globalFunctions.onBlocker(!document.pointerLockElement)
  }

  connect = () => {
    document.addEventListener('mousemove', this.onMouseMove, false)
    document.addEventListener('keydown', this.keydown, false)
    document.addEventListener('keyup', this.keyup, false)
    document.addEventListener('pointerlockchange', this.pointerlockchange)
    document.getElementById('blocker').addEventListener('click', this.blocker, false)
  }

  disconnect = () => {
    document.removeEventListener('mousemove', this.onMouseMove, false)
    document.removeEventListener('keydown', this.keydown, false)
    document.removeEventListener('keyup', this.keyup, false)
    document.removeEventListener('pointerlockchange', this.pointerlockchange)
    document.getElementById('blocker').removeEventListener('click', this.blocker, false)
  }
}

export default class PointerLockControls {
  constructor(camera) {
    this.camera = camera
    this.connect()
  }

  yourHeight = (height = 12) => this.crouch ? height / 2 : height
  crouch = false
  moveForward = false
  moveBackward = false
  moveLeft = false
  moveRight = false
  canJump = false
  euler = new THREE.Euler(0, 0, 0, 'YXZ')
  clock = new THREE.Clock()
  velocity = new THREE.Vector3()
  direction = new THREE.Vector3()
  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10 + this.yourHeight())
  PI_2 = Math.PI / 2

  control = objects => {
    if (document.pointerLockElement) {
      let onObject = this.raycaster.intersectObjects(objects).length > 0
      let delta = this.clock.getDelta()

      this.raycaster.ray.origin.copy(this.camera.position)
      // this.raycaster.ray.origin.y -= 10

      this.velocity.x -= this.velocity.x * 10.0 * delta
      this.velocity.z -= this.velocity.z * 10.0 * delta
      this.velocity.y -= config.gravity * config.yourMass * delta

      this.direction.z = Number(this.moveForward) - Number(this.moveBackward)
      this.direction.x = Number(this.moveLeft) - Number(this.moveRight)
      // this.direction.normalize() // this ensures consistent movements in all directions

      if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * config.moveSpeed * 10 * delta
      if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * config.moveSpeed * 10 * delta
      if (onObject === true) {this.velocity.y = Math.max(0, this.velocity.y); this.canJump = true}

      this.camera.position.y += this.velocity.y * delta // new behavior | поведение
      this.camera.translateX(this.velocity.x * delta)
      this.camera.translateZ(this.velocity.z * delta)

      if (this.camera.position.y < this.yourHeight()) {
        this.velocity.y = 0
        this.camera.position.y = this.yourHeight()
        this.canJump = true
      }
    }
  }

  onMouseMove = event => {
    if (!document.pointerLockElement) return

    let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
    let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0

    this.euler.setFromQuaternion(this.camera.quaternion)
    this.euler.y -= movementX * 0.002
    this.euler.x -= movementY * 0.002
    this.euler.x = Math.max(-this.PI_2, Math.min(this.PI_2, this.euler.x))
    this.camera.quaternion.setFromEuler(this.euler)

    if (this.skyBox) this.skyBox.quaternion.setFromEuler(this.euler).inverse()
  }

  keydown = event => {
    switch (event.keyCode) {
      case 38: case 87: this.moveForward = true; break;  // forward
      case 37: case 65: this.moveLeft = true; break;     // left
      case 40: case 83: this.moveBackward = true; break; // back
      case 39: case 68: this.moveRight = true; break;    // right
      case 17: this.crouch = true; break;                // crouch
      case 32: if (this.canJump == true) {this.velocity.y += config.jumpHeight * 10}; this.canJump = false; break;
    }
  }

  keyup = event => {
    switch (event.keyCode) {
      case 38: case 87: this.moveForward = false; break;  // forward
      case 37: case 65: this.moveLeft = false; break;     // left
      case 40: case 83: this.moveBackward = false; break; // back
      case 39: case 68: this.moveRight = false; break;    // right
      case 17: this.crouch = false; break;                // crouch
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

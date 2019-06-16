export default class PointerLockControls {
	constructor(camera, domElem) {
		this.camera = camera
		this.euler = new THREE.Euler(0, 0, 0, 'YXZ')
		this.domElem = domElem
		this.clock = new THREE.Clock()
    this.velocity = new THREE.Vector3()
    this.direction = new THREE.Vector3()
    this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10)

		this.onMouseMove = this.onMouseMove.bind(this)

		this.connect()
	}

	PI_2 = Math.PI/2
	moveForward = false
	moveBackward = false
	moveLeft = false
	moveRight = false
	canJump = false

	control(objects) {
    if (document.pointerLockElement) {
      this.raycaster.ray.origin.copy(this.getObject().position)
      this.raycaster.ray.origin.y -= 10

      let intersections = this.raycaster.intersectObjects(objects)
      let onObject = intersections.length > 0
      let delta = this.clock.getDelta()

      this.velocity.x -= this.velocity.x * 10.0 * delta
      this.velocity.z -= this.velocity.z * 10.0 * delta
      this.velocity.y -= window.config.gravity * window.config.yourMass * delta

      this.direction.z = Number(this.moveForward) - Number(this.moveBackward)
      this.direction.x = Number(this.moveLeft) - Number(this.moveRight)
      this.direction.normalize() // this ensures consistent movements in all directions

      if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * window.config.moveSpeed * delta
      if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * window.config.moveSpeed * delta
      if (onObject === true) {
        this.velocity.y = Math.max(0, this.velocity.y)
        this.canJump = true
      }

      this.getObject().translateX(this.velocity.x * delta)
      this.getObject().position.y += (this.velocity.y * delta) // new behavior
      this.getObject().translateZ(this.velocity.z * delta)

      if (this.getObject().position.y < 10) {
        this.velocity.y = 0
        this.getObject().position.y = 10
        this.canJump = true
      }
    }
  }

	onMouseMove(event) {
		if (!document.pointerLockElement) return

		let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
		let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0

		this.euler.setFromQuaternion(this.camera.quaternion)

		this.euler.y -= movementX * 0.002
		this.euler.x -= movementY * 0.002

		this.euler.x = Math.max(-this.PI_2, Math.min(this.PI_2, this.euler.x))

		this.camera.quaternion.setFromEuler(this.euler)
	}

	keydown = (e) => {
    switch (e.keyCode) {
      case 38: case 87: this.moveForward = true; break; // forward
      case 37: case 65: this.moveLeft = true; break; // left
      case 40: case 83: this.moveBackward = true; break; // back
      case 39: case 68: this.moveRight = true; break; //right
      case 32: if (this.canJump == true) {this.velocity.y += window.config.jumpHeight * 10}; this.canJump = false; break;
    }
	}

	keyup = (e) => {
		switch (e.keyCode) {
      case 38: case 87: this.moveForward = false; break; // forward
      case 37: case 65: this.moveLeft = false; break; // left
      case 40: case 83: this.moveBackward = false; break; // back
      case 39: case 68: this.moveRight = false; break; //right
    }
	}

	blocker = () => {
    document.pointerLockElement ?
      document.exitPointerLock() :
      document.body.requestPointerLock()
	}

	pointerlockchange = () => {
    if (document.pointerLockElement) {
      blocker.style.display = 'none'
      instructions.style.display = 'none'
    } else {
      blocker.style.display = 'block'
      instructions.style.display = ''
    } 
	}

	connect = () => {
		document.addEventListener('mousemove', this.onMouseMove, false)
		document.addEventListener('pointerlockchange', this.nPointerlockChange, false)
		document.addEventListener('pointerlockerror', this.onPointerlockError, false)
		document.addEventListener('keydown', (e) => this.keydown(e), false)
		document.addEventListener('keyup', (e) => this.keyup(e), false)
    document.addEventListener('pointerlockchange', this.pointerlockchange)
		document.getElementById('blocker').addEventListener('click', this.blocker, false)
	}

	disconnect = () => {
		document.removeEventListener('mousemove', this.onMouseMove, false)
		document.removeEventListener('pointerlockchange', this.nPointerlockChange, false)
		document.removeEventListener('pointerlockerror', this.onPointerlockError, false)
		document.removeEventListener('keydown', (e) => this.keydown(e), false)
		document.removeEventListener('keyup', (e) => this.keyup(e), false)
    document.removeEventListener('pointerlockchange', this.pointerlockchange)
		document.getElementById('blocker').removeEventListener('click', this.blocker, false)
	}

	getObject = () => {
		return this.camera
	}

	getDirection = () => {
		let direction = new THREE.Vector3(0, 0, -1)
		return (v) => {
			return v.copy(direction).applyQuaternion(camera.quaternion)
		}
	}
}

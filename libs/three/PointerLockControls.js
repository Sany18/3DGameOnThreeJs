export default class PointerLockControls {
	constructor(camera, domElem) {
		this.camera = camera
		this.euler = new THREE.Euler(0, 0, 0, 'YXZ')
		this.domElem = domElem

		this.onMouseMove = this.onMouseMove.bind(this)
		this.keydown = this.keydown.bind(this)
		this.keyup = this.keyup.bind(this)

		this.connect()
	}

	PI_2 = Math.PI / 2
	moveForward = false
	moveBackward = false
	moveLeft = false
	moveRight = false
	canJump = false
	velocity = ''

	control(raycaster, velocity, direction, clock, objects) {
		this.velocity = velocity
    if (document.pointerLockElement) {
      raycaster.ray.origin.copy(this.getObject().position)
      raycaster.ray.origin.y -= 10

      let intersections = raycaster.intersectObjects(objects)
      let onObject = intersections.length > 0
      let delta = clock.getDelta()

      velocity.x -= velocity.x * 10.0 * delta
      velocity.z -= velocity.z * 10.0 * delta
      velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      direction.z = Number(this.moveForward) - Number(this.moveBackward)
      direction.x = Number(this.moveLeft) - Number(this.moveRight)
      direction.normalize(); // this ensures consistent movements in all directions

      if (this.moveForward || this.moveBackward) velocity.z -= direction.z * 400.0 * delta
      if (this.moveLeft || this.moveRight) velocity.x -= direction.x * 400.0 * delta
      if (onObject === true) {
        velocity.y = Math.max( 0, velocity.y )
        this.canJump = true;
      }

      this.getObject().translateX(velocity.x * delta)
      this.getObject().position.y += (velocity.y * delta) // new behavior
      this.getObject().translateZ(velocity.z * delta)

      if (this.getObject().position.y < 10) {
        velocity.y = 0
        this.getObject().position.y = 10
        this.canJump = true
      }
    }
  }

	onMouseMove(event) {
		if (!document.pointerLockElement) return;

		let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		this.euler.setFromQuaternion(this.camera.quaternion);

		this.euler.y -= movementX * 0.002;
		this.euler.x -= movementY * 0.002;

		this.euler.x = Math.max(-this.PI_2, Math.min(this.PI_2, this.euler.x));

		this.camera.quaternion.setFromEuler(this.euler)
	}

	keydown = (e) => {
    switch (e.keyCode) {
      case 38: case 87: this.moveForward = true; break; // forward
      case 37: case 65: this.moveLeft = true; break; // left
      case 40: case 83: this.moveBackward = true; break; // back
      case 39: case 68: this.moveRight = true; break; //right
      case 32: if (this.canJump == true) {this.velocity.y += 350}; this.canJump = false; break;
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

	connect = () => {
		document.addEventListener('mousemove', this.onMouseMove, false);
		document.addEventListener('pointerlockchange', this.nPointerlockChange, false);
		document.addEventListener('pointerlockerror', this.onPointerlockError, false);
		document.addEventListener('keydown', (e) => this.keydown(e), false)
		document.addEventListener('keyup', (e) => this.keyup(e), false)

		document.getElementById('blocker').addEventListener('click', function() {
      document.pointerLockElement ?
        document.exitPointerLock() :
        document.body.requestPointerLock()
    }, false)

    document.addEventListener('pointerlockchange', function(e){
      if (document.pointerLockElement) {
        blocker.style.display = 'none'
        instructions.style.display = 'none'
      } else {
        blocker.style.display = 'block'
        instructions.style.display = ''
      } 
    })
	}

	disconnect = () => {
		document.removeEventListener('mousemove', this.onMouseMove, false);
		document.removeEventListener('pointerlockchange', this.nPointerlockChange, false);
		document.removeEventListener('pointerlockerror', this.onPointerlockError, false);
	}

	getObject = () => {
		return this.camera
	}

	getDirection = () => {
		direction = new THREE.Vector3( 0, 0, - 1 );
		return (v) => {
			return v.copy(direction).applyQuaternion(camera.quaternion)
		}
	}
}

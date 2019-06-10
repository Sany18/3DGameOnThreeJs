THREE.FirstPersonControls = function(camera) {
	let moveDistance = 0
	let rotateAngle = 0

	this.update = function(delta) { 
		moveDistance = 150 * delta
	  rotateAngle = Math.PI / 2 * delta
	}

	let target = new THREE.Vector3()
	let x = 0, y = 0, z = 0
	camera.rotation.order = "YXZ"

	function moveCamera(e) {
		camera.rotation.x = x += e.movementY/-200
    camera.rotation.y = y += e.movementX/-200
	}

	document.addEventListener("click", function (e) {
		document.body.requestPointerLock()
		document.body.addEventListener("mousemove", moveCamera)
	})

	document.onkeydown = function(e) {
		console.log(e.key)
		if (e.key == "Escape") {
			document.exitPointerLock()
			document.body.removeEventListener("mousemove", moveCamera)
		}

		if (e.key == "ArrowUp" || e.key == "w") {camera.translateZ(-moveDistance)}
		if (e.key == "ArrowDown" || e.key == "s") {camera.translateZ(moveDistance)}
		if (e.key == "ArrowLeft" || e.key == "q") {camera.rotateOnAxis(new THREE.Vector3(0,1,0), rotateAngle)}
		if (e.key == "ArrowRight" || e.key == "e") {camera.rotateOnAxis(new THREE.Vector3(0,1,0), -rotateAngle)}
	}
}

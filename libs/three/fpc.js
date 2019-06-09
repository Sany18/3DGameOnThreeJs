THREE.FirstPersonControls = function(camera, renderer) {
	let clock = new window.THREE.Clock()
	let delta = clock.getDelta()
	let moveDistance = 150 * delta
	let rotateAngle = Math.PI / 2 * delta


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
		if(e.key === "Escape") {
			document.exitPointerLock()
			document.body.removeEventListener("mousemove", moveCamera)
		}
	}
}

document.addEventListener('DOMContentLoaded', function() {
	let [scene, camera, renderer, stats, stats2, stats3] = createScene()

	let cube = makeCube(0xff00ff, -1)
	let cube1 = makeCube(0xff0000, 1)
	let cube2 = makeCube(0xffff00, 0)

	setLight(-2, 0, 5)

	var material2 = new THREE.LineBasicMaterial({ color: 0xff00ff })
	var geometry2 = new THREE.Geometry()
	geometry2.vertices.push(new THREE.Vector3(-1, 0, 0))
	geometry2.vertices.push(new THREE.Vector3(0, 1, 0))
	var line = new THREE.Line(geometry2, material2)
	scene.add(line)



	let animate = function(time) {
		stats.begin(); stats2.begin(); stats3.begin()
		time *= 0.001
		// console.log(time)
		cube.rotation.x += 0.01
		cube1.rotation.y += 0.02

		cube2.rotation.z += 0.002
		cube2.rotation.y += 0.002
		cube2.rotation.x += 0.002

		// moveCamera(camera)

		renderer.render(scene, camera)
		requestAnimationFrame(animate)
		stats.end(); stats2.end(); stats3.end();
	}
	animate()






	function moveCamera(camera) {
		if (camera.position.x < 1) {
			camera.position.x += 0.01
		} else if (camera.position.x > 1) {
			camera.position.x -= 0.01
		}
	}

	function setLight(x, y, z) {
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(x, y, z);
		scene.add(light)
	}

	function makeCube(color, x) {
		const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
		const material = new THREE.MeshPhongMaterial({color})
		const cube = new THREE.Mesh(geometry, material)
		scene.add(cube)
		cube.position.x = x

		return cube
	}

	function createScene() {
		let scene = new THREE.Scene()
		let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
		camera.position.z = 2
		let renderer = new THREE.WebGLRenderer()
		renderer.setSize(window.innerWidth, window.innerHeight)
		document.body.appendChild(renderer.domElement)

		var stats = new Stats()
		var stats2 = new Stats()
		var stats3 = new Stats()
		stats.showPanel(0)
		stats2.showPanel(1)
		stats3.showPanel(2)
		stats.dom.style.cssText = 'position:absolute;bottom:0px;left:0px;'
		stats2.dom.style.cssText = 'position:absolute;bottom:0px;left:80px;'
		stats3.dom.style.cssText = 'position:absolute;bottom:0px;left:160px;'
		document.body.appendChild(stats.dom)
		document.body.appendChild(stats2.dom)
		document.body.appendChild(stats3.dom)
		return [scene, camera, renderer, stats, stats2, stats3]
	}
})

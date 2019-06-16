THREE.globalFunctions = {
	loadBasicTexture: (address) => (new THREE.TextureLoader()).load(
		window.config.imagePrefix + address,
		function (texture) {
			let material = new THREE.MeshBasicMaterial({ map: texture })
		},
		function (xhr) {
			console.log((xhr.loaded/xhr.total * 100) + ' % loaded')
		},
		function (xhr) {
			console.log('An error happened with ' + address)
		}
	)
}

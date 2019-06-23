const quantity = 8
let counter = 0
let sizeCounter = 0
let totalSize = 0
let loader = new THREE.TextureLoader()

THREE.globalFunctions = {
	loadBasicTexture: address => {
		const url = window.config.imagePrefix + address
		return loader.load(
			url,
			texture => {
				++counter;
				if (window.config.showTesturesSize) getFileSize(url);
				if (counter >= quantity) {
					console.info(`Textures loaded (${counter} of ${quantity})`) 
				}
			},
			xhr => console.info((xhr.loaded/xhr.total * 100) + ' % loaded'), //temporarily unavailable
			xhr => console.info('Texture not loaded ' + address)
		)
	},
	onChangeProperties: () => {},
	checkVars: (main) => console.log(main),
}

function getFileSize(url) {	
	fetch(url).then(r => {
		++sizeCounter
		totalSize += +r.headers.get("Content-Length")
		if (sizeCounter >= quantity) console.log('Textures size: ' + totalSize.fileSize(1))
	})
}

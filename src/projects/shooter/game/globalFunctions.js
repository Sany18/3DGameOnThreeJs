let counter = 0
let sizeCounter = 0
let totalSize = 0

THREE.loadBasicTexture = address => {
  const url = config.imagePrefix + address

  return new THREE.TextureLoader().load(
    url,
    texture => {
      ++counter
      if (config.showTesturesSize) getFileSize(url)
    },
    xhr => console.info((xhr.loaded/xhr.total * 100) + ' % loaded'), // temporarily unavailable
    xhr => console.info('Texture not loaded ' + address)
  )
}

function getFileSize(url) {
  fetch(url).then(r => {
    ++sizeCounter
    totalSize += +r.headers.get("Content-Length")
    if (sizeCounter >= config.textures) console.log('Textures size: ' + totalSize.fileSize(1))
  })
}

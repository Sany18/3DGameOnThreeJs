include * from 'three';

document.addEventListener('DOMContentLoaded', function() {
  let scene = new THREE.Scene()
  let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
  let renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  let geometry = new THREE.BoxGeometry(1, 1, 0.5)
  let material = new THREE.MeshBasicMaterial({ color: 0xf0ff00 })
  let cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  camera.position.z = 2

  var material2 = new THREE.LineBasicMaterial({ color: 0xff00ff })
  var geometry2 = new THREE.Geometry()
  geometry2.vertices.push(new THREE.Vector3(-1, 0, 0))
  geometry2.vertices.push(new THREE.Vector3(0, 1, 0))
  var line = new THREE.Line(geometry2, material2)
  scene.add(line)

  let animate = function() {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.02

        // moveCamera(camera)

        renderer.render(scene, camera)
        requestAnimationFrame(animate)
      }
      animate()
    })

function moveCamera(camera) {
  if (camera.position.x < 1) {
    camera.position.x += 0.01
  } else if (camera.position.x > 1) {
    camera.position.x -= 0.01
  }
}

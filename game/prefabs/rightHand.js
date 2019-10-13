let rightHand = (scene, camera) => {
  let loader = new THREE.FontLoader();

  loader.load("../../assets/fonts3d/helvetiker_bold.typeface.json", font => {
    let geometry = new THREE.TextGeometry("Right hand", {
      font: font,
      size: .1,
      height: .1,
      curveSegments: 1,
      bevelEnabled: true,
      bevelThickness: 0,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 0
    });
    let material = new THREE.MeshPhongMaterial({ color: 0xff0505 })
    let text = new THREE.Mesh(geometry, material)
    text.position.set(1, -.7, -1.3);
    text.rotateY(Math.PI * 1.6)
    text.rotateX(Math.PI * -.1)
    text.rotateZ(Math.PI * .1)

    camera.add(text)
  });
}

export default rightHand

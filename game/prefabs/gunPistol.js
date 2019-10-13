let GunPistol = (scene, camera, plasmaBalls, bulletsSpeed) => {
  new THREE.OBJLoader().load(config.imagePrefix + 'pistol/Cerberus.obj', (weapon) => {
    let material = new THREE.MeshStandardMaterial();
    let loader = new THREE.TextureLoader().setPath(config.imagePrefix + 'pistol/');

    material.roughness = 1;
    material.metalness = 1;

    material.map = loader.load('Cerberus_A.jpg');
    material.metalnessMap = material.roughnessMap = loader.load('Cerberus_RM.jpg');
    material.normalMap = loader.load('Cerberus_N.jpg');

    material.map.wrapS = THREE.RepeatWrapping;
    material.roughnessMap.wrapS = THREE.RepeatWrapping;
    material.metalnessMap.wrapS = THREE.RepeatWrapping;
    material.normalMap.wrapS = THREE.RepeatWrapping;

    weapon.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    weapon.position.set(1, -.5, -1.5);
    camera.add(weapon);
  });

  // bullets

  !function bullets() {
    let emitter = new THREE.Object3D()
    let wpVector =  new THREE.Vector3()
    emitter.position.set(1, -.5, -1.5);
    camera.add(emitter);

    window.addEventListener("mousedown", (e) => {
      if (!e.button) {
        let plasmaBall = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 8, 4),
          new THREE.MeshBasicMaterial({ color: "brown" })
        );

        plasmaBall.position.copy(emitter.getWorldPosition(wpVector))
        plasmaBall.quaternion.copy(camera.quaternion)
        plasmaBall.collision = new THREE.Box3().setFromObject(plasmaBall);

        scene.add(plasmaBall)
        plasmaBalls.push(plasmaBall)
      } else {
        if (bulletsSpeed == 50) {
          bulletsSpeed = 0
        } else {
          bulletsSpeed = 50
        }
      }
    });
  }()
}

export default GunPistol

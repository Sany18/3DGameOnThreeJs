document.addEventListener('DOMContentLoaded', function() {
  let [
    stats, controls, renderer, scene, camera,
    raycaster, objects, prevTime, velocity,
    direction, moveForward, moveBackward, moveLeft,
    moveRight, canJump
  ] = init()

  animate();



  function animate() {
    stats[0].begin(); stats[1].begin(); stats[2].begin()
    requestAnimationFrame(animate);

    if (controls.isLocked === true) {
      raycaster.ray.origin.copy(controls.getObject().position);
      raycaster.ray.origin.y -= 10;

      let intersections = raycaster.intersectObjects( objects );
      let onObject = intersections.length > 0;
      let time = performance.now();
      let delta = (time - prevTime)/1000;

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;
      velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveLeft) - Number(moveRight);
      direction.normalize(); // this ensures consistent movements in all directions

      if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
      if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
      if ( onObject === true ) {
        velocity.y = Math.max( 0, velocity.y );
        canJump = true;
      }

      controls.getObject().translateX( velocity.x * delta );
      controls.getObject().position.y += ( velocity.y * delta ); // new behavior
      controls.getObject().translateZ( velocity.z * delta );

      if ( controls.getObject().position.y < 10 ) {
        velocity.y = 0;
        controls.getObject().position.y = 10;
        canJump = true;
      }
      prevTime = time;
    }

    renderer.render( scene, camera );
    stats[0].end(); stats[1].end(); stats[2].end();
  }






















  function init() {
    let camera, scene, renderer, controls, raycaster;
    let objects = [];
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let canJump = false;

    let prevTime = performance.now();
    let velocity = new THREE.Vector3();
    let direction = new THREE.Vector3();
    let vertex = new THREE.Vector3();
    let color = new THREE.Color();

    // stats
    let stats = new Stats()
    let stats2 = new Stats()
    let stats3 = new Stats()
    stats.showPanel(0)
    stats2.showPanel(1)
    stats3.showPanel(2)
    stats.dom.style.cssText = 'position:absolute;bottom:0px;left:0px;'
    stats2.dom.style.cssText = 'position:absolute;bottom:0px;left:80px;'
    stats3.dom.style.cssText = 'position:absolute;bottom:0px;left:160px;'
    document.body.appendChild(stats.dom)
    document.body.appendChild(stats2.dom)
    document.body.appendChild(stats3.dom)
    stats = [stats, stats2, stats3]
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000 );
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0xffffff, 0, 750);

    let light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    controls = new THREE.PointerLockControls( camera );

    let blocker = document.getElementById( 'blocker' );
    let instructions = document.getElementById( 'instructions' );

    instructions.addEventListener( 'click', function () {
      controls.lock();
    }, false );

    controls.addEventListener( 'lock', function () {
      instructions.style.display = 'none';
      blocker.style.display = 'none';
    });

    controls.addEventListener('unlock', function() {
      blocker.style.display = 'block';
      instructions.style.display = '';
    });

    scene.add(controls.getObject())

    let onKeyDown = function(e) {
      switch (e.keyCode) {
        case 38: case 87: moveForward = true; break; // forward
        case 37: case 65: moveLeft = true; break; // left
        case 40: case 83: moveBackward = true; break; // back
        case 39: case 68: moveRight = true; break; //right
        case 32: if (canJump == true) {velocity.y += 350}; canJump = false; break;
      }
    };

    let onKeyUp = function(e) {
      switch (e.keyCode) {
        case 38: case 87: moveForward = false; break; // forward
        case 37: case 65: moveLeft = false; break; // left
        case 40: case 83: moveBackward = false; break; // back
        case 39: case 68: moveRight = false; break; //right
      }
    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

    // floor

    let floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
    floorGeometry.rotateX( - Math.PI / 2 );

    // vertex displacement

    let position = floorGeometry.attributes.position;

    for ( let i = 0, l = position.count; i < l; i ++ ) {
      vertex.fromBufferAttribute( position, i );

      vertex.x += Math.random() * 20 - 10;
      vertex.y += Math.random() * 2;
      vertex.z += Math.random() * 20 - 10;

      position.setXYZ( i, vertex.x, vertex.y, vertex.z );
    }

    floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

    position = floorGeometry.attributes.position;
    let colors = [];

    for ( let i = 0, l = position.count; i < l; i ++ ) {
      color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
      colors.push( color.r, color.g, color.b );
    }

    floorGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    let floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

    let floor = new THREE.Mesh( floorGeometry, floorMaterial );
    scene.add( floor );

    // objects

    let boxGeometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
    boxGeometry = boxGeometry.toNonIndexed(); // ensure each face has unique vertices

    position = boxGeometry.attributes.position;
    colors = [];

    for ( let i = 0, l = position.count; i < l; i ++ ) {
      color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
      colors.push( color.r, color.g, color.b );
    }

    boxGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    for ( let i = 0; i < 500; i ++ ) {
      let boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors } );
      boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

      let box = new THREE.Mesh( boxGeometry, boxMaterial );
      box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
      box.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
      box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;

      scene.add( box );
      objects.push( box );
    }

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener('resize', onWindowResize, false );
    function onWindowResize() {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    return [
      stats, controls, renderer, scene, camera,
      raycaster, objects, prevTime, velocity,
      direction, moveForward, moveBackward, moveLeft,
      moveRight, canJump
    ]
  }
})

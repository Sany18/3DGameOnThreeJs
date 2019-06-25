import './libs/reload.js'
import './game/config.js'
import './game/other.js'
// import './game/physics.js'
import './game/globalFunctions.js'
import initWorld from './game/initWorld.js'

document.addEventListener('DOMContentLoaded', main)

function main() {
  let [
    stats, controls, renderer, scene, camera,
    objects, gui, skyBox, light
  ] = initWorld()











  //https://medium.com/@bluemagnificent/intro-to-javascript-3d-physics-using-ammo-js-and-three-js-dd48df81f591
  var clock = new THREE.Clock()
  console.log(THREE.Clock())
  var tmpTrans
  var physicsWorld, rigidBodies = [];
  let colGroupPlane = 1, colGroupRedBall = 2, colGroupGreenBall = 4
  //Ammojs Initialization
  Ammo().then(start)
  function start (){
      tmpTrans = new Ammo.btTransform();
      setupPhysicsWorld();
      createBlock();
      createBall();
      createMaskBall();
      renderFrame();
  }
  function setupPhysicsWorld(){
      let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
          dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
          overlappingPairCache    = new Ammo.btDbvtBroadphase(),
          solver                  = new Ammo.btSequentialImpulseConstraintSolver();
      physicsWorld           = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
      physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
  }
  function renderFrame(){
      let deltaTime = clock.getDelta();
      updatePhysics( deltaTime );
      renderer.render( scene, camera );
      requestAnimationFrame( renderFrame );
  }
  function createBlock(){
      
      let pos = {x: 0, y: 0, z: 0};
      let scale = {x: 50, y: 2, z: 50};
      let quat = {x: 0, y: 0, z: 0, w: 1};
      let mass = 0;
      //threeJS Section
      let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({color: 0xa0afa4}));
      blockPlane.position.set(pos.x, pos.y, pos.z);
      blockPlane.scale.set(scale.x, scale.y, scale.z);
      blockPlane.castShadow = true;
      blockPlane.receiveShadow = true;
      scene.add(blockPlane);
      //Ammojs Section
      let transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
      transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
      let motionState = new Ammo.btDefaultMotionState( transform );
      let colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
      colShape.setMargin( 0.05 );
      let localInertia = new Ammo.btVector3( 0, 0, 0 );
      colShape.calculateLocalInertia( mass, localInertia );
      let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
      let body = new Ammo.btRigidBody( rbInfo );
      physicsWorld.addRigidBody( body, colGroupPlane, colGroupRedBall );
  }
  function createBall(){
      
      let pos = {x: 0, y: 20, z: 0};
      let radius = 2;
      let quat = {x: 0, y: 0, z: 0, w: 1};
      let mass = 1;
      //threeJS Section
      let ball = new THREE.Mesh(new THREE.SphereBufferGeometry(radius), new THREE.MeshPhongMaterial({color: 0xff0505}));
      ball.position.set(pos.x, pos.y, pos.z);
      
      ball.castShadow = true;
      ball.receiveShadow = true;
      scene.add(ball);
      //Ammojs Section
      let transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
      transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
      let motionState = new Ammo.btDefaultMotionState( transform );
      let colShape = new Ammo.btSphereShape( radius );
      colShape.setMargin( 0.05 );
      let localInertia = new Ammo.btVector3( 0, 0, 0 );
      colShape.calculateLocalInertia( mass, localInertia );
      let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
      let body = new Ammo.btRigidBody( rbInfo );
      physicsWorld.addRigidBody( body, colGroupRedBall, colGroupPlane | colGroupGreenBall );
      
      ball.userData.physicsBody = body;
      rigidBodies.push(ball);
  }
  function createMaskBall(){
      
      let pos = {x: 1, y: 30, z: 0};
      let radius = 2;
      let quat = {x: 0, y: 0, z: 0, w: 1};
      let mass = 1;
      //threeJS Section
      let ball = new THREE.Mesh(new THREE.SphereBufferGeometry(radius), new THREE.MeshPhongMaterial({color: 0x00ff08}));
      ball.position.set(pos.x, pos.y, pos.z);
      
      ball.castShadow = true;
      ball.receiveShadow = true;
      scene.add(ball);
      //Ammojs Section
      let transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
      transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
      let motionState = new Ammo.btDefaultMotionState( transform );
      let colShape = new Ammo.btSphereShape( radius );
      colShape.setMargin( 0.05 );
      let localInertia = new Ammo.btVector3( 0, 0, 0 );
      colShape.calculateLocalInertia( mass, localInertia );
      let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
      let body = new Ammo.btRigidBody( rbInfo );
      physicsWorld.addRigidBody( body, colGroupGreenBall, colGroupRedBall);
      
      ball.userData.physicsBody = body;
      rigidBodies.push(ball);
  }
  function updatePhysics( deltaTime ){
      // Step world
      physicsWorld.stepSimulation( deltaTime, 10 );
      // Update rigid bodies
      for ( let i = 0; i < rigidBodies.length; i++ ) {
          let objThree = rigidBodies[ i ];
          let objAmmo = objThree.userData.physicsBody;
          let ms = objAmmo.getMotionState();
          if ( ms ) {
              ms.getWorldTransform( tmpTrans );
              let p = tmpTrans.getOrigin();
              let q = tmpTrans.getRotation();
              objThree.position.set( p.x(), p.y(), p.z() );
              objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );
          }
      }
  }
























  !function boxes() {
    let boxGeometry = new THREE.BoxBufferGeometry(20, 20, 20)
    let boxTexture = THREE.globalFunctions.loadBasicTexture('woodBox.png')
    let boxMaterial = new THREE.MeshPhongMaterial({ map: boxTexture })

    for (let i = 0; i < 10; i++) {
      let box = new THREE.Mesh(boxGeometry, boxMaterial)
      box.castShadow = true
      box.receiveShadow = true

      box.position.x = Math.floor(Math.random() * 20 - 10) * 20
      box.position.z = Math.floor(Math.random() * 20 - 10) * 20
      box.position.y = 10

      scene.add(box)
      objects.push(box)
    }
  }()

  // let light = function() {
  //   let light = new THREE.PointLight(0xffffff, 1, 1000)
  //   light.position.set(0, 50, -50)
  //   light.castShadow = true
  //   scene.add(light)

  //   return light
  // }()

  // scene.background = new THREE.Color('#bd00b5')
  // scene.fog = new THREE.Fog(0xffffff, 100, 800)

  // http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  // const state = {
  //   height: 20
  // }

  // // var f1 = gui.addFolder('PointLight');
  // // f1.add(state, 'height', 0, 100);

  //axes
  if (window.config.showAxes) objects.forEach((node) => {
    const axes = new THREE.AxesHelper()
    axes.material.depthTest = false
    axes.renderOrder = 1
    node.add(axes)
  })

  function action(time) {
    // THREE.globalFunctions.checkVars()
    // light.position.y = state.height

    // objects.forEach((obj) => {
    //   obj.rotation.y = time/1000
    // })
  }

  !function animate(time) {
    stats.start()
    requestAnimationFrame(animate)

    action(time)
    controls.control(objects)

    renderer.render(scene, camera)
    stats.end()
  }()
}

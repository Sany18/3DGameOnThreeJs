import '../config.js'
import initWorld from './initWorld.js'
import './globalFunctions.js'
import './other.js'
import './console.js'
import './wsChat.js'
import '../libs/reload.js'
import '../libs/three/OBJLoader.js'

document.addEventListener('DOMContentLoaded', main)

function main() {
  let {
    stats, controls, renderer, scene, camera,
    objects, gui, skyBox, light, clock, tmpTrans,
    physicsWorld, rigidBodies
  } = initWorld()

  let colGroupPlane = 1,
      colGroupRedBall = 2,
      colGroupGreenBall = 4

  function setupPhysicsWorld() {
    let { gravity } = window.config;
    let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
        dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
        overlappingPairCache    = new Ammo.btDbvtBroadphase(),
        solver                  = new Ammo.btSequentialImpulseConstraintSolver();

    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -gravity, 0));
  }

  function updatePhysics(deltaTime) {
    physicsWorld.stepSimulation(deltaTime, 10)

    for (let i = 0; i < rigidBodies.length; i++) {
      let objThree = rigidBodies[i];
      let objAmmo = objThree.userData.physicsBody;
      let ms = objAmmo.getMotionState();
      if (ms) {
        ms.getWorldTransform(tmpTrans);
        let p = tmpTrans.getOrigin();
        let q = tmpTrans.getRotation();
        objThree.position.set(p.x(), p.y(), p.z());
        objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
      }
    }
  }

  function createBlock() {
    let pos = {x: 0, y: -1.1, z: 0};
    let scale = {x: 500, y: 2, z: 500};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;

    //threeJS Section
    let boxGeometry = new THREE.BoxBufferGeometry()
    let boxTexture = THREE.globalFunctions.loadBasicTexture('woodBox.png')
    let boxMaterial = new THREE.MeshPhongMaterial({ map: boxTexture })
    let block = new THREE.Mesh(boxGeometry, boxMaterial)

    block.position.set(pos.x, pos.y, pos.z);
    block.scale.set(scale.x, scale.y, scale.z);
    block.castShadow = true;
    block.receiveShadow = true;
    scene.add(block);

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);
    let colShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x*.5, scale.y*.5, scale.z*.5));
    colShape.setMargin(0.05);
    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);
    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
    let body = new Ammo.btRigidBody(rbInfo);
    physicsWorld.addRigidBody(body);
  }

  function createBall() {
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
    // physicsWorld.addRigidBody( body, colGroupRedBall, colGroupPlane | colGroupGreenBall );
    physicsWorld.addRigidBody(body);

    ball.userData.physicsBody = body;
    rigidBodies.push(ball);
  }

  function createBall2() {
    let pos = {x: 1, y: 30, z: 0};
    let radius = 2;
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 10;
    //threeJS Section
    let ball = new THREE.Mesh(new THREE.SphereBufferGeometry(radius), new THREE.MeshPhongMaterial({ color: 0x00ff08 }));
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
    physicsWorld.addRigidBody(body);

    ball.userData.physicsBody = body;
    rigidBodies.push(ball);
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

      box.collision = new THREE.Box3().setFromObject(box);

      scene.add(box)
      objects.push(box)
    }
  }()

  // http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  const state = {
    height: 20
  }

  // // var f1 = gui.addFolder('PointLight');
  // // f1.add(state, 'height', 0, 100);

  //axes
  if (window.config.showAxes) objects.forEach((node) => {
    const axes = new THREE.AxesHelper()
    axes.material.depthTest = false
    axes.renderOrder = 1
    node.add(axes)
  })

  Ammo().then(() => {
    tmpTrans = new Ammo.btTransform();
    setupPhysicsWorld();

    //objects
    createBlock();
    createBall();
    createBall2();
  })










  // weapon
  new THREE.OBJLoader()
    .load(config.imagePrefix + 'pistol/Cerberus.obj', (weapon) => {
    var material = new THREE.MeshStandardMaterial();
    var loader = new THREE.TextureLoader().setPath(config.imagePrefix + 'pistol/');

    material.roughness = 1; // attenuates roughnessMap
    material.metalness = 1; // attenuates metalnessMap

    material.map = loader.load('Cerberus_A.jpg');
    material.metalnessMap = material.roughnessMap = loader.load('Cerberus_RM.jpg');
    material.normalMap = loader.load('Cerberus_N.jpg');

    material.map.wrapS = THREE.RepeatWrapping;
    material.roughnessMap.wrapS = THREE.RepeatWrapping;
    material.metalnessMap.wrapS = THREE.RepeatWrapping;
    material.normalMap.wrapS = THREE.RepeatWrapping;

    weapon.traverse((child) => {
      if ( child instanceof THREE.Mesh ) {
        child.material = material;
      }
    });

    weapon.position.set(1, -.5, -1.5);
    camera.add(weapon);
  });

  // bullets
  let plasmaBalls = [];
  let bulletsSpeed = 0;

  !function weapon() {
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

  function action(time, delta) {
    light.position.y = state.height

    plasmaBalls.forEach(bullet => {
      bullet.translateZ(-bulletsSpeed * delta);
    });
  }

  !function animate(time) {
    let deltaTime = clock.getDelta();
    stats.start()

    action(time, deltaTime)
    controls.control(objects)
    updatePhysics(deltaTime);

    renderer.render(scene, camera)
    stats.end()
    requestAnimationFrame(animate)
  }()
}

import React, { Component } from 'react'
import * as THREE from 'three'
import Physijs from 'physijs-webpack'
import { EffectComposer, RenderPass } from 'postprocessing'

// import { Player, DirectionLight, Floor, Skybox,
//          Weapon, Boxes, RightHand, AnotherPlayer,
//          Walls } from './game/prefabs/index.js'
import { Player } from './game/prefabs/index.js'
import './game/index.js'

class Shooter extends Component {
  componentDidMount() {
    /* frame */
    const iframe = document.createElement('iframe')
    document.querySelector('#root').appendChild(iframe)

    const window = iframe.contentWindow
    const iframeDocument = iframe.contentDocument

    iframe.classList.add('content')
    iframeDocument.body.setAttribute('style', 'margin: 0')

    /* program */
    let scene = new THREE.Scene()
    let clock = new THREE.Clock()
    let objects = []
    let state = {
      camera: {
        angle: 75,
        far: 1000,
        near: .1
      }
    }
    let config = {
      resolutionMultiplier: 1,
      antialias: false,
      gravity: 980
    }

    /* physis */
    Physijs.scripts.worker = '/libs/physis/physijs_worker.js'
    Physijs.scripts.ammo = '/libs/physis/ammo.js'
    scene = new Physijs.Scene({ reportsize: 60, fixedTimeStep: 1 / 60 })
    scene.setGravity(new THREE.Vector3(0, -config.gravity, 0))

    /* camera */
    let camera = new THREE.PerspectiveCamera(
      state.camera.angle, window.innerWidth / window.innerHeight,
      state.camera.near, state.camera.far)

    let listener = new THREE.AudioListener()
    let music = new THREE.Audio(listener)
    camera.add(listener)

    /* renderer */
    let renderer = new THREE.WebGLRenderer({ antialias: config.antialias })
    renderer.setPixelRatio(devicePixelRatio * config.resolutionMultiplier)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMapSoft = true
    renderer.shadowCameraNear = 3
    renderer.shadowCameraFar = camera.far
    renderer.shadowCameraFov = 50
    renderer.shadowMapBias = 0.0039
    renderer.shadowMapDarkness = .5
    renderer.shadowMapWidth = 1024
    renderer.shadowMapHeight = 1024
    iframeDocument.body.appendChild(renderer.domElement)

    /* filters / shaders */
    const composer = new EffectComposer(renderer)
    const pass = new RenderPass(scene, camera)
    composer.addPass(pass)
    pass.renderToScreen = true

    /* global listeners */
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
    }, false)

    // let isMusicEnable = false
    // iframeDocument.querySelector('.music').addEventListener('click', () => {
    //   isMusicEnable = !isMusicEnable
    //
    //   if (isMusicEnable) {
    //     iframeDocument.querySelector('.music').innerHTML = 'Music on'
    //     music.setVolume(config.music / 100)
    //   } else {
    //     iframeDocument.querySelector('.music').innerHTML = 'Music off'
    //     music.setVolume(0)
    //   }
    // })

    // let isSoundsEnable = false
    // iframeDocument.querySelector('.sounds').addEventListener('click', () => {
    //   isSoundsEnable = !isSoundsEnable
    //
    //   isSoundsEnable
    //    ? iframeDocument.querySelector('.sounds').innerHTML = 'Sounds on'
    //    : iframeDocument.querySelector('.sounds').innerHTML = 'Sounds off'
    // })


    /* music */
    // let musicLoader = new THREE.AudioLoader()
    // musicLoader.load(assets("music/Tommy - Flyin'.mp3"), buffer => {
    //   music.setBuffer(buffer)
    //   music.setLoop(true)
    //   music.setVolume(0)
    //   music.play()
    // })

    /* objects */
    // Skybox(scene)
    // Floor(scene)
    // Boxes(scene, 1)
    // DirectionLight(scene)
    // Walls(scene)
    // let weapon = Weapon(camera, listener)

    scene.fog = new THREE.Fog(0xc20000)

    window.player = new Player(camera, scene)
    // let testPlayer = new AnotherPlayer(scene, '[test player]')

    let raycaster = new THREE.Raycaster()
    window.addEventListener('click', () => {
      let position = camera.getWorldPosition(new THREE.Vector3())
      let direction = camera.getWorldDirection(new THREE.Vector3())

      // if (isSoundsEnable) {
      //   weapon.sound.isPlaying && weapon.sound.stop()
      //   weapon.sound.play()
      // }

      raycaster.set(position, direction)

      raycaster.intersectObjects(scene.children, true).forEach(i => {
        if (i.object.name == 'box') console.log('hit box')
        if (i.object.name == 'wall') console.log('hit wall')
        if (i.object.name == 'realPlayer') {
          window.send('i heat ' + i.object.networkId)
        }
      })
    })

    /* network */
    window.pause = false
    window.networkPlayers = {}
    window.definedNetworkPlayers = {}
    window.myId = 0

    function updateNetworkPlayers() {
      for (let key in window.networkPlayers) {
        if (window.networkPlayers[key].__pos__ != window.myId) {
          setNetworkPlayerPosition(
            key,
            window.networkPlayers[key].position,
            window.networkPlayers[key].quaternion
          )
        }
      }

      // const players = Object.keys(networkPlayers).length
      // iframeDocument.querySelector('#players_online').innerHTML = players
    }

    function setNetworkPlayerPosition(__id__, pos, qua) {
      if (window.definedNetworkPlayers[__id__]) {
        window.definedNetworkPlayers[__id__].position.set(pos.x, pos.y, pos.z)
        window.definedNetworkPlayers[__id__].quaternion.set(qua._x, qua._y, qua._z, qua._w)
      } else {
        // window.definedNetworkPlayers[__id__] = new AnotherPlayer(scene, __id__)
      }
    }

    function sendOwnCoordinates() {
      if (!window.send.isOpen || !window.myId) { return }

      window.send(JSON.stringify({
        __pos__: window.myId,
        position: window.player.body.position,
        quaternion: window.player.body.quaternion
      }))
    }

    window.addEventListener('unload', () => {
      window.send(JSON.stringify({ __destroy__: window.myId }))
      window.send('bye ' + window.myId)
    })

    /* action */
    const action = (time, delta) => {
      sendOwnCoordinates()
      updateNetworkPlayers()

      // testPlayer.rotation.y += .02

      window.player.control()
    }

    const animate = (time, delta = clock.getDelta()) => {
      action(time, delta)
      composer.render(delta)
      scene.simulate()

      requestAnimationFrame(animate)
    }; animate()
  }

  componentWillUnmount() {
    document.querySelector('.content').remove()
  }

  render() { return (
    <>
      <div id='blocker'>
        <span id='menu-button'>Menu</span>
      </div>

      <div id='console'>
        <input id='console_input' />
        <span id='console_text'>Custom console v0.0.2</span>
      </div>

      <form id='chat'>
        <div class='chat-messages-field'></div>
        <input class='chat-input' type='text' />
      </form>
    </>
  )}
}

export default Shooter

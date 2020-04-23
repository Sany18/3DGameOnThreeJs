import React, { Component } from 'react'
import * as THREE from 'three'
import { EffectComposer, RenderPass } from 'postprocessing'
import { Player, DirectionLight, Floor, Skybox,
         Weapon, Boxes, RightHand, AnotherPlayer,
         Walls } from './game/prefabs/index.js'
import './game/index.js'
import './assets/styles.css'

class Shooter extends Component {
  componentDidMount() {
    /* frame */
    const Physijs = require('physijs-browserify')(THREE)
    const iframe = document.createElement('iframe')
    document.querySelector('#root').appendChild(iframe)

    const iframeWindow = iframe.contentWindow
    const iframeDocument = iframe.contentDocument

    iframe.classList.add('content')
    iframeDocument.body.setAttribute('style', 'margin: 0')

    /* program */
    let scene = new THREE.Scene()
    let clock = new THREE.Clock()
    
    let config = {
      camera: {
        angle: 75,
        far: 1000,
        near: .1
      },
      resolutionMultiplier: 1,
      antialias: false,
      gravity: 980,
      music: 15,
      isMusicEnable: false
    }

    /* physis */
    Physijs.scripts.worker = window.location.origin + '/lib/physijs_worker.js'
    Physijs.scripts.ammo = window.location.origin + '/lib/ammo.js'

    scene = new Physijs.Scene({ reportsize: 60, fixedTimeStep: 1 / 60 })
    scene.setGravity(new THREE.Vector3(0, -config.gravity, 0))

    /* camera */
    let camera = new THREE.PerspectiveCamera(
      config.camera.angle, iframeWindow.innerWidth / iframeWindow.innerHeight,
      config.camera.near, config.camera.far)

    let listener = new THREE.AudioListener()
    let music = new THREE.Audio(listener)
    camera.add(listener)

    /* renderer */
    let renderer = new THREE.WebGLRenderer({ antialias: config.antialias })
    renderer.setPixelRatio(devicePixelRatio * config.resolutionMultiplier)
    renderer.setSize(iframeWindow.innerWidth, iframeWindow.innerHeight)
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
    iframeWindow.addEventListener('resize', () => {
      camera.aspect = iframeWindow.innerWidth / iframeWindow.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(iframeWindow.innerWidth, iframeWindow.innerHeight)
      composer.setSize(iframeWindow.innerWidth, iframeWindow.innerHeight)
    }, false)

    // iframeDocument.querySelector('.music').addEventListener('click', () => {
    //   config.isMusicEnable = !config.isMusicEnable
    
    //   if (config.isMusicEnable) {
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
    
    //   isSoundsEnable
    //    ? iframeDocument.querySelector('.sounds').innerHTML = 'Sounds on'
    //    : iframeDocument.querySelector('.sounds').innerHTML = 'Sounds off'
    // })


    /* music */
    let musicLoader = new THREE.AudioLoader()
    musicLoader.load(require("./assets/music/Tommy - Flyin'.mp3"), buffer => {
      music.setBuffer(buffer)
      music.setLoop(true)
      music.setVolume(0.15)
      music.play()
    })

    /* objects */
    Skybox(scene)
    Floor(scene, Physijs)
    Boxes(scene, 1, Physijs)
    DirectionLight(scene)
    Walls(scene, Physijs)
    let weapon = Weapon(camera, listener)

    scene.fog = new THREE.Fog(0xc20000)

    let player = new Player(camera, scene, Physijs)
    let testPlayer = new AnotherPlayer(scene, '[test player]')

    let raycaster = new THREE.Raycaster()
    iframeWindow.addEventListener('click', () => {
      let position = camera.getWorldPosition(new THREE.Vector3())
      let direction = camera.getWorldDirection(new THREE.Vector3())

      if (1) {
        weapon.sound.isPlaying && weapon.sound.stop()
        weapon.sound.play()
      }

      raycaster.set(position, direction)

      raycaster.intersectObjects(scene.children, true).forEach(i => {
        if (i.object.name == 'box') console.log('hit box')
        if (i.object.name == 'wall') console.log('hit wall')
        if (i.object.name == 'realPlayer') {
          iframeWindow.send('i heat ' + i.object.networkId)
        }
      })
    })

    /* network */










    let pause = false
    let networkPlayers = {}
    let definedNetworkPlayers = {}
    let myId = 0
    
    let socketEndpoint = window.location.protocol == 'https:' ? 'wss://' : 'ws://'
        socketEndpoint += window.location.host
    
    let ws = new WebSocket(socketEndpoint)
    let send = ws.send.bind(ws)
    send.isOpen = false
    
    document.querySelector('#chat').addEventListener('submit', e => {
      e.preventDefault()
      let value = e.target.lastElementChild.value
    
      if (value) send(value)
      e.target.lastElementChild.value = ''
    })
    
    ws.onerror = error => {
      send.isOpen = false
      addSystemMessageToChatWindow('[ws error]' + error.message)
    }
    
    ws.onopen = () => {
      send.isOpen = true
    
      addSystemMessageToChatWindow('[ws status]' + 'Соединение установлено.')
    }
    
    ws.onmessage = event => {
      const data = JSON.parse(event.data)
    
      if (~data.message.indexOf('__pos__')) {
        const player = JSON.parse(data.message)
    
        return networkPlayers[player.__pos__] = player
      }
    
      if (~data.message.indexOf('__id__')) {
        return myId = JSON.parse(data.message).__id__
      }
    
      if (~data.message.indexOf('__destroy__')) {
        const idToDelete = JSON.parse(data.message).__destroy__
    
        delete networkPlayers[idToDelete]
        scene.remove(definedNetworkPlayers[idToDelete])
        delete definedNetworkPlayers[idToDelete]
        return
      }
    
      addDataToChatWindow(data)
    }
    
    ws.onclose = (e) => {
      send.isOpen = false
    
      send('bye')
    
      e.wasClean
        ? console.log('[ws status]', 'Соединение закрыто чисто')
        : console.log('[ws status]', 'Обрыв соединения')
    
      addSystemMessageToChatWindow('[ws status] Код: ' + e.code + ' причина: ' + e.reason)
    }
    
    function addDataToChatWindow(data) {
      let localTime = localTimeFormat(data)
      let chatWindow = document.querySelector('.chat-messages-field')
      let message = document.createElement('div')
      let timeStamp = document.createElement('span')
      let massageText = document.createElement('span')
    
      message.className = 'chat-message'
      timeStamp.className = 'chat-timestamp'
      massageText.className = 'chat-massage-text'
    
      timeStamp.innerHTML = localTime
      massageText.innerHTML = data.message
    
      message.appendChild(timeStamp)
      message.appendChild(massageText)
      chatWindow.appendChild(message)
    
      chatWindow.scrollTop = chatWindow.scrollHeight
    }
    
    function addSystemMessageToChatWindow(data) {
      let chatWindow = document.querySelector('.chat-messages-field')
      let message = document.createElement('div')
      let timeStamp = document.createElement('span')
    
      message.className = 'chat-message'
      timeStamp.className = 'chat-timestamp'
      timeStamp.innerHTML = data
    
      message.appendChild(timeStamp)
      chatWindow.appendChild(message)
    
      chatWindow.scrollTop = chatWindow.scrollHeight
    }
    
    function localTimeFormat(data) {
      const d = new Date(data.timestamp);
      const localTime = `${d.getFullYear()}/${zr(d.getMonth()+1)}/${zr(d.getDate())} `+
                        `${d.getHours()}:${zr(d.getMinutes())} `
      return localTime;
    }
    
    function zr(value) { return value >= 10 ? value : '0' + value }
    













    function updateNetworkPlayers() {
      for (let key in networkPlayers) {
        if (networkPlayers[key].__pos__ != myId) {
          setNetworkPlayerPosition(
            key,
            networkPlayers[key].position,
            networkPlayers[key].quaternion
          )
        }
      }

      // const players = Object.keys(networkPlayers).length
      // iframeDocument.querySelector('#players_online').innerHTML = players
    }

    function setNetworkPlayerPosition(__id__, pos, qua) {
      if (definedNetworkPlayers[__id__]) {
        definedNetworkPlayers[__id__].position.set(pos.x, pos.y, pos.z)
        definedNetworkPlayers[__id__].quaternion.set(qua._x, qua._y, qua._z, qua._w)
      } else {
        definedNetworkPlayers[__id__] = new AnotherPlayer(scene, __id__)
      }
    }

    function sendOwnCoordinates() {
      if (!send.isOpen || !myId) { return }

      send(JSON.stringify({
        __pos__: myId,
        position: player.body.position,
        quaternion: player.body.quaternion
      }))
    }

    iframeWindow.addEventListener('unload', () => {
      send(JSON.stringify({ __destroy__: myId }))
      send('bye ' + myId)
    })

    /* action */
    const action = (time, delta) => {
      sendOwnCoordinates()
      updateNetworkPlayers()

      testPlayer.rotation.y += .01

      player.control()
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
        <div className='chat-messages-field'></div>
        <input className='chat-input' type='text' />
      </form>
    </>
  )}
}

export default Shooter

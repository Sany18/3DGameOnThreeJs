import React, { Component } from 'react'
import * as THREE from 'three'
import { DirectionLight, Floor, FlyCameraControl, Skybox,
         Mountain } from './objects/index.js'
import { EffectComposer, RenderPass } from 'postprocessing'
import Stats from '../../lib/stats.js'
import './styles.scss'

class SynthvaveVisualiser extends Component {
  constructor() {
    super()

    this.state = {
      allDevices: [],
      currentDevice: 'default'
    }

    this._content = React.createRef()
  }

  componentDidMount() {
    this.runIframe()
  }

  runIframe = () => {
    navigator.mediaDevices.enumerateDevices().then(allDevices => this.setState({ allDevices }))

    const iframeWindow = this._content.current.contentWindow
    const iframeDocument = this._content.current.contentDocument

    iframeDocument.body.setAttribute('style', 'margin: 0')

    const randInt = window.randInt
    const scene = new THREE.Scene()
    const clock = new THREE.Clock()
    const stats = new Stats()
    const state = {
      camera: { angle: 75, far: 5000, near: .1 }
    }

    /* camera */
    let camera = new THREE.PerspectiveCamera(
      state.camera.angle, iframeWindow.innerWidth / iframeWindow.innerHeight,
      state.camera.near, state.camera.far)
    camera.position.y = 1
    camera.position.z = 20

    /* renderer */
    let renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(devicePixelRatio * 1)
    renderer.setSize(iframeWindow.innerWidth, iframeWindow.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMapSoft = true
    renderer.shadowCameraNear = state.camera.near
    renderer.shadowCameraFar = state.camera.far
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

    /* global. listeners */
    iframeWindow.addEventListener('resize', () => {
      camera.aspect = iframeWindow.innerWidth / iframeWindow.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(iframeWindow.innerWidth, iframeWindow.innerHeight)
      composer.setSize(iframeWindow.innerWidth, iframeWindow.innerHeight)
    }, false)

    /* After initialize */
    /* objects */
    Skybox(scene)
    DirectionLight(scene)

    const floorTexture = Floor(scene)
    // const line = Equalizer(scene)
    const mountains = []
    const flyCamera = FlyCameraControl(camera, iframeDocument)

    scene.fog = new THREE.Fog(0xc20000, .1, 100)

    /* analyser */
    let analyser, dataArray = false
    const handleSuccess = stream => {
      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)

      analyser = audioCtx.createAnalyser()
      source.connect(analyser)
      analyser.fftSize = 64

      dataArray = new Uint8Array(analyser.frequencyBinCount)
    }

    const updateVisualiser = () => {
      if (!dataArray) { return }

      analyser.getByteFrequencyData(dataArray)

      while (mountains.length < 15) {
        mountains.push(Mountain(scene, randInt(-15, 15), randInt(0, -20)))
      }

      for (let i = 0; i < mountains.length; i++) {
        mountains[i].updateMountainHeight(dataArray[i * 2] / 35)
        mountains[i].position.z += .02

        if (mountains[i].position.z > 20) {
          scene.remove(mountains[i])
          mountains.splice(i, 1)
        }
      }

      // for (let i = 0; i < dataArray.length; i++) {
        // line.geometry.vertices[i].y = dataArray[i] / 20
      // }

      // line.geometry.verticesNeedUpdate = true
    }

    navigator.mediaDevices.getUserMedia({ audio: { deviceId: this.state.currentDevice }, video: false })
      .then(handleSuccess)

    /* action */
    const action = (time, delta) => {
      stats.showFps()
      flyCamera(delta)
      if (floorTexture.image) floorTexture.offset.y += .02
      updateVisualiser()
    }

    const animate = (time, delta = clock.getDelta()) => {
      action(time, delta)
      composer.render(delta)
      requestAnimationFrame(animate)
    }; animate()
  }

  getDevice = elem => {
    this.setState({ currentDevice: elem.target.dataset.deviceid })
  }

  renderDeviceButtons = () => (
    this.state.allDevices.map((device, ind) => (
      device.kind == 'audioinput'
        ? <div className='iframe_html__device'
              data-deviceid={device.deviceId}
              key={'device' + ind}
              onClick={this.getDevice}>
            {device.label}
          </div>
        : null
    ))
  )

  render() {
    console.log('devideId:', this.state.currentDevice)

    return (
      <>
        <iframe className='content' title='.' ref={this._content} />
        <div className='iframe_html'>
          {this.renderDeviceButtons()}
        </div>
      </>
    )
  }
}

export default SynthvaveVisualiser

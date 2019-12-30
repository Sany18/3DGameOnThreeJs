import React, { Component } from 'react'
import * as THREE from 'three'
import { DirectionLight, Floor, FlyCameraControl, Skybox,
         Equalizer } from './objects/index.js'
import { EffectComposer, RenderPass } from 'postprocessing'
import Stats from '../../lib/stats.js'

class SynthvaveVisualiser extends Component {
  constructor() {
    super()

    this._content = React.createRef()
  }

  componentDidMount() {
    const iframeWindow = this._content.current.contentWindow
    const iframeDocument = this._content.current.contentDocument

    iframeDocument.body.setAttribute('style', 'margin: 0')

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
      // composer.setSize(iframeWindow.innerWidth, iframeWindow.innerHeight)
    }, false)

    /* After initialize */

    /* objects */
    let line = Equalizer(scene)
    Skybox(scene)
    const floorTexture = Floor(scene)
    DirectionLight(scene)
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

      for (let i = 0; i < dataArray.length; i++) {
        line.geometry.vertices[i].y = dataArray[i] / 20
      }

      line.geometry.verticesNeedUpdate = true
    }

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
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

  render() { return (
    <iframe className='content' title='.' ref={this._content} />
  )}
}

export default SynthvaveVisualiser

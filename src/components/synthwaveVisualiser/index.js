import { Component } from 'react'
import * as THREE from 'three'
import { DirectionLight, Floor, FlyCameraControl, Skybox } from './objects/index.js'
import { EffectComposer, RenderPass } from 'postprocessing'
// import Stats from '../libs/stats.js'

class SynthvaveVisualiser extends Component {
  componentDidMount() {
    /* frame */
    const iframe = document.createElement('iframe')
    document.querySelector('#root').appendChild(iframe)

    const iframeWindow = iframe.contentWindow
    const iframeDocument = iframe.contentDocument

    iframe.classList.add('content')
    iframeDocument.body.setAttribute('style', 'margin: 0')

    /* program */
    const scene = new THREE.Scene()
    const clock = new THREE.Clock()
    // let stats = new Stats()
    const state = {
      camera: { angle: 75, far: 1000, near: .1 }
    }

    /* camera */
    let camera = new THREE.PerspectiveCamera(
      state.camera.angle, iframeWindow.innerWidth / iframeWindow.innerHeight,
      state.camera.near, state.camera.far)
    camera.position.y = 5
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
    let line = Floor(scene)
    DirectionLight(scene)
    Skybox(scene)
    const flyCamera = FlyCameraControl(camera, iframeDocument)
    scene.fog = new THREE.Fog(0xc20000)

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
      // if (config.showFps) stats.showFps().showMemory()
      flyCamera(delta)
      updateVisualiser()
    }

    const animate = (time, delta = clock.getDelta()) => {
      action(time, delta)
      composer.render(delta)
      requestAnimationFrame(animate)
    }; animate()
  }

  componentWillUnmount() {
    document.querySelector('.content').remove()
  }

  render() { return null }
}

export default SynthvaveVisualiser

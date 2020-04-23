import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import './styles.scss'

class Main extends Component {
  constructor() {
    super()

    this._content = React.createRef()
  }

  componentDidMount() {
    const iframeWindow = this._content.current.contentWindow
    const iframeDocument = this._content.current.contentDocument

    iframeDocument.body.setAttribute('style', 'margin: 0')

    iframeWindow.THREE = THREE

    let vanta = iframeDocument.createElement('script')
    vanta.setAttribute('src', '../lib/vanta.net.min.js')
    iframeDocument.head.appendChild(vanta)

    vanta.addEventListener('load', () => {
      let vantaUsage = iframeDocument.createElement('script')
      vantaUsage.innerHTML = 'VANTA.NET({ el: "body", color: 0x3e3e3e, backgroundColor: 0x0, '+
        'maxDistance: 10, spacing: 30, points: 20 })'
      iframeDocument.body.appendChild(vantaUsage)

      document.querySelector('#loader').classList.add('loader-disable')
    })
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.mouseMove)
  }

  renderCursorTail = () => {
    const cursorCircles = document.getElementsByClassName('cursors-circle')
    const circles = document.getElementsByClassName('cursors-circle-main')
    const segLength = 30
    const segAmount = 5
    const segSize = 5
    const c = Array(segAmount).fill(0).map(_ => ({ x: 0, y: 0, angle: 0 }))

    document.addEventListener('mousemove', this.mouseMove)

    this.mouseMove = e => {
      segment(0, e.clientX, e.clientY)

      for (let i = 0; i < segAmount - 1; ++i) {
        segment(i + 1, c[i].x, c[i].y)
      }

      function segment(i, xin, yin) {
        let dx = xin - c[i].x
        let dy = yin - c[i].y

        c[i].angle = Math.atan2(dy, dx)
        c[i].x = xin - Math.cos(c[i].angle) * segLength
        c[i].y = yin - Math.sin(c[i].angle) * segLength
      }

      circles[0].style.transform = `translate(${e.clientX}px, ${e.clientY}px)`

      for (let i = 0; i < segAmount - 1; i++) {
        cursorCircles[i].style.transform = `translate(${c[i].x}px, ${c[i].y}px) rotate(${c[i].angle}deg)`
      }
    }

    return (
      <>{c.map((_, i) => (i
        ? <div className={'cursors-circle cursors-circle-' + (i + 1)}
              style={{ width: segSize / i + 'px', height: segSize / i + 'px',
                       marginTop: (-segSize / i) / 2 + 'px', marginLeft: (-segSize / i) / 2 + 'px' }}
              key={'cc' + i}></div>
        : <div className='cursors-circle-main' key={'cc' + i}></div>
      ))}</>
    )
  }

  render() { return (
    <>
      <div id='loader'>Loading...</div>
      <nav className='main-navigation'>
        <Link className='main-navigation__link' to='/synthwave'>Synthwave player</Link>
        <Link className='main-navigation__link' to='/x2'>Dark shooter</Link>
        {this.renderCursorTail()}
      </nav>
      <iframe className='content' title='.' ref={this._content} />
    </>
  )}
}

export default Main

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import './styles.scss'

class Main extends Component {
  componentDidMount() {
    const iframe = document.createElement('iframe')
    document.querySelector('#root').appendChild(iframe)

    const iframeWindow = iframe.contentWindow
    const iframeDocument = iframe.contentDocument

    iframe.classList.add('content')
    iframeDocument.body.setAttribute('style', 'margin: 0')

    iframeWindow.THREE = THREE

    let vanta = iframeDocument.createElement('script')
    vanta.setAttribute('src', '../lib/vanta.net.min.js')
    iframeDocument.head.appendChild(vanta)
    vanta.addEventListener('load', () => {
      let vantaUsage = iframeDocument.createElement('script')
      vantaUsage.innerHTML = 'VANTA.NET({ el: "body", color: 0x396600, backgroundColor: 0x0, '+
        'maxDistance: 45, spacing: 40, points: 4, showDots: false })'
      iframeDocument.body.appendChild(vantaUsage)
    })
  }

  componentWillUnmount() {
    document.querySelector('.content').remove()
  }

  renderCursorTail = () => {
    const cursorCircles = document.getElementsByClassName('cursors-circle')
    const segLength = 30
    const sygments = 7
    const size = 5
    const c = Array(sygments).fill(0).map(_ => {
      const o = new Object
      o.x = 0; o.y = 0; o.angle = 0
      return o
    })

    document.addEventListener('mousemove', e => {
      dragSegment(0, e.clientX, e.clientY)

      for (let i = 0; i < sygments - 1; ++i) {
        dragSegment(i + 1, c[i].x, c[i].y)
      }

      function dragSegment(i, xin, yin) {
        let dx = xin - c[i].x
        let dy = yin - c[i].y
        c[i].angle = Math.atan2(dy, dx)

        c[i].x = xin - Math.cos(c[i].angle) * segLength
        c[i].y = yin - Math.sin(c[i].angle) * segLength
      }

      for (let i = 0; i < sygments - 1; i++) {
        cursorCircles[i].style.transform = `translate(${c[i].x}px, ${c[i].y}px) rotate(${c[i].angle}deg)`
      }
    })

    return (
      <>{c.map((_, i) => (i &&
        <div className={'cursors-circle cursors-circle-' + (i + 1)}
            style={{ width: size / i + 'px', height: size / i + 'px',
                     marginTop: (-size / i) / 2 + 'px', marginLeft: (-size / i) / 2 + 'px' }}
            key={'cc' + i}></div>
      ))}</>
    )
  }

  render() { return (
    <nav className='main-navigation'>
      <Link className='main-navigation__link' to='/synthwave'>Synthwave player</Link>
      <Link className='main-navigation__link' to='/x2'>Dark shooter</Link>
      {this.renderCursorTail()}
    </nav>
  )}
}

export default Main

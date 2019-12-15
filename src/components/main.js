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
      vantaUsage.innerHTML = 'VANTA.NET({ el: "body", color: 0x59ff00, backgroundColor: 0x0, '+
        'maxDistance: 25, spacing: 20, points: 4, showDots: false })'
      iframeDocument.body.appendChild(vantaUsage)
    })
  }

  componentWillUnmount() {
    document.querySelector('.content').remove()
  }

  render() { return (
    <nav className='main-navigation'>
      <Link className='main-navigation__link' to='/synthwave'>Synthwave player</Link>
      <Link className='main-navigation__link' to='/x2'>Dark shooter</Link>
    </nav>
  )}
}

export default Main

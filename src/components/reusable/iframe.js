import React, { Component } from 'react'
import * as THREE from 'three'

class ComponentName extends Component {
  constructor() {
    super()

    this._content = React.createRef()
  }

  componentDidMount() {
    const iframeWindow = this._content.current.contentWindow
    const iframeDocument = this._content.current.contentDocument
    
    iframeDocument.body.setAttribute('style', 'margin: 0')

    iframeWindow.THREE = THREE

    // let vanta = iframeDocument.createElement('script')
    // vanta.setAttribute('src', '../lib/vanta.net.min.js')
    // iframeDocument.head.appendChild(vanta)

    vanta.addEventListener('load', () => {  })
  }

  render() { return (
    <iframe className='content' title='.' ref={this._content} />
  )}
}

export default ComponentName

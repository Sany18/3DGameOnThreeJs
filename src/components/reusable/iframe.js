import { Component } from 'react'

class ComponentName extends Component {
  componentDidMount() {
    /* frame */
    const iframe = document.createElement('iframe')
    document.querySelector('#root').appendChild(iframe)

    const iframeWindow = iframe.contentWindow
    const iframeDocument = iframe.contentDocument

    iframe.classList.add('content')
    iframeDocument.body.setAttribute('style', 'margin: 0')

    /* program */
    /* ... */
  }

  componentWillUnmount() {
    document.querySelector('.content').remove()
  }

  render() { return null }
}

export default ComponentName

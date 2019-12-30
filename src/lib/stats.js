export default class Stats {
  constructor(elem = document.body) {
    const elemStat = document.createElement('div')
    elemStat.id = 'stats'
    elemStat.style = 'position: absolute; color: #ffda24; font-size: .3cm; line-height: .4cm'
    elem.appendChild(elemStat)

    this.elemFPS = document.createElement('div')
    this.elemFPS.id = 'fps'
    elemStat.appendChild(this.elemFPS)

    this.elemMemory = document.createElement('div')
    this.elemMemory.id = 'memory'
    elemStat.appendChild(this.elemMemory)
  }

  counter = 0
  lastCalledTime = performance.now()
  fps = 0
  delta = 0
  updatesPerSecond = 60 / 5

  showFps() {
    if (++this.counter != this.updatesPerSecond) { return this } else this.counter = 0;

    this.delta = (performance.now() - this.lastCalledTime) / 1000 / this.updatesPerSecond;
    this.lastCalledTime = performance.now();
    this.fps = Math.floor(1 / this.delta)
    this.elemFPS.innerHTML = this.fps

    return this
  }

  showMemory() {
    if (this.counter != 0) { return this }

    this.elemMemory.innerHTML = performance.memory.usedJSHeapSize.fileSize()

    return this
  }
}

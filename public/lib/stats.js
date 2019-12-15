export default class Stats {
  counter = 0
  lastCalledTime = performance.now()
  fps = 0
  delta = 0
  updatesPerSecond = 60 / 5
  fpsElement = parent.document.querySelector('#fps')
  memoryElement = parent.document.querySelector('#memory')

  showFps() {
    if (++this.counter != this.updatesPerSecond) { return this } else this.counter = 0;

    this.delta = (performance.now() - this.lastCalledTime) / 1000 / this.updatesPerSecond;
    this.lastCalledTime = performance.now();
    this.fps = Math.floor(1 / this.delta)
    this.fpsElement.innerHTML = this.fps

    return this
  }

  showMemory() {
    if (this.counter != 0) { return this }

    this.memoryElement.innerHTML = performance.memory.usedJSHeapSize.fileSize()

    return this
  }
}

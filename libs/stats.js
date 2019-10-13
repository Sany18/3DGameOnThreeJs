export default class Stats {
  counter = 0
  lastCalledTime = performance.now()
  fps = 0
  delta = 0
  updatesPerSecond = 60 / 5
  element = document.querySelector('#fps')
  
  showFps() {
    if (++this.counter != this.updatesPerSecond) { return } else this.counter = 0;

    this.delta = (performance.now() - this.lastCalledTime) / 1000 / this.updatesPerSecond;
    this.lastCalledTime = performance.now();
    this.fps = Math.floor(1 / this.delta)
    this.element.innerHTML = this.fps
  }
}

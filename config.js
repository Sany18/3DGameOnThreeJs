window.config = {
  API_WS: location.href
            .replace("3001", "8080")
            .replace("http", "ws"),

	shadowResolution: 2048,
	resolutionMultiplier: 1,
	imagePrefix: `${location.origin}/assets/textures/`,
	moveSpeed: 40,
	yourMass: 100.0,
	gravity: 9.8,
	jumpHeight: 25,

  textures: 9,

	debug: true,
	enableShadows: true,
	showAxes: false,
	showTesturesSize: true,
	helperLight: false
}

window.console.debug && console.warn("Debug mode on")
window.console.debug && console.table(window.config, ["names", "values"])

window.log = console.log

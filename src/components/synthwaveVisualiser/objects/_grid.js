http://madebyevan.com/shaders/grid/

function GridMaterial(params) {
    var {cellSize,lineSize,cellColor,lineColor} = params||{}
    var vertexShader = `
    varying vec3 vertex;
    varying vec4 worldVertex;
    void main(){
        vertex = position;
        gl_Position = worldVertex = projectionMatrix * modelViewMatrix * vec4(position,1.0); //project the transformed cube, modelMatrix ommited because all thats needed is the translation
    }
    `;
    var fragmentShader = `
varying vec3 vertex;
varying vec4 worldVertex;
uniform float uCellSize;
uniform float uLineSize;
uniform vec4 uCellColor;//=vec3(0.24,0.24,0.05);
uniform vec4 uLineColor;//=vec3(0.0,0.25,0.0);
​
void main(){
vec2 coord = vertex.xy / uCellSize;
// Compute anti-aliased world-space grid lines
vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
float line = min(1.0,min(grid.x, grid.y));
// Just visualize the grid lines directly
​
float depthCutoff = 1.0-fract(min(0.9998,worldVertex.z/100.0));
vec4 color = mix(uLineColor,uCellColor,line);
color.a *= depthCutoff;
gl_FragColor = color;//(1.0-line)*
​
}`
    THREE.ShaderMaterial.call(this, {
        uniforms: {},
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,//render the backside of the cube
        depthWrite: false,
        depthTest: true,
        transparent:true,
        alphaTest:.5,
        extensions:{
      derivatives: true, // set to use derivatives
      //fragDepth: true, // set to use fragment depth values
        }
      //  opacity:0.2
    });
​
    this.addUniform('cellSize','f',(undefined !== cellSize)?cellSize:1)
    this.addUniform('lineSize','f',(undefined !== lineSize)?lineSize:0.01)
    this.addUniform('cellColor','v4',(undefined !== cellColor)?cellColor:new THREE.Vector4(1,1,1,0))
    this.addUniform('lineColor','v4',(undefined !== lineColor)?lineColor:new THREE.Vector4(1,1,1,1))
​
}
​
GridMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
GridMaterial.prototype.addUniform = function(uname,utype,uvalue){
    var ufname = 'u'+(uname.slice(0,1).toUpperCase())+uname.slice(1)
    this.uniforms[ufname]={type:utype,value:uvalue,needsUpdate:true};
    Object.defineProperty(this, uname, {
        get: function() {
            return this.uniforms[ufname].value
        },
        set: function(v) {
            this.uniforms[ufname].value = v;
            this.uniforms[ufname].needsUpdate = true;
        }
    });
    this.uniformsNeedUpdate = true;
}
​
GridMaterial.constructor = GridMaterial;

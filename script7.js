import * as THREE from './three/three.module.js';

// import {
//   OrbitControls
// } from './three/OrbitControls.js';
import {
  Water
} from './three/Water.js';
// import {
//   Sky
// } from './three/Sky.js';

import {
  FresnelShader
} from './three/shader.js';
// import { RGBELoader } from './three/RGBELoader.js';

var container, stats;
var camera, scene, renderer, light;
var controls, water, avatar;
var spheres = [];
var mouseX = 0,
  mouseY = 0;
document.addEventListener('mousemove', onDocumentMouseMove, false);

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
  //bg cube
  var path = "./three/textures/skybox_sunset/";
  var format = '.png';
  var urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format
  ];

  var textureCube = new THREE.CubeTextureLoader().load(urls);

  scene = new THREE.Scene();
  scene.background = textureCube;

  // create spheres
  var geometry = new THREE.SphereBufferGeometry(100, 32, 16);
  var shader = FresnelShader;
  var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
  uniforms["tCube"].value = textureCube;
  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader
  });

  for (var i = 0; i < 500; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 10000 - 5000;
    mesh.position.y = Math.random() * 10000 - 5000;
    mesh.position.z = Math.random() * 10000 - 5000;
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 0.1 + 1;
    scene.add(mesh);
    spheres.push(mesh);
  }

  container = document.getElementById('myContainer');

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);


  // scene = new THREE.Scene();



  // camera.position.set(30, 30, 100);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
  camera.position.z = 3200;

  light = new THREE.DirectionalLight(0xff1a00, 0.8);
  scene.add(light);


  var waterGeometry = new THREE.PlaneBufferGeometry(10000, 10000);

  water = new Water(
    waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load('./three/waternormals.jpg', function(texture) {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      }),
      alpha: 0.1,
      sunDirection: light.position.clone().normalize(),
      sunColor: 0xffe2a8,
      waterColor: 0xa8feff,
      distortionScale: 0.5,
      fog: scene.fog !== undefined
    }
  );

  water.rotation.x = -Math.PI / 2;

  scene.add(water);

  // Skybox

  // var sky = new Sky();
  //
  // var uniforms = sky.material.uniforms;
  //
  // uniforms['turbidity'].value = 30;
  // uniforms['rayleigh'].value = 3;
  // uniforms['luminance'].value = 1;
  // uniforms['mieCoefficient'].value = 0.003;
  // uniforms['mieDirectionalG'].value = 0.9;
  //
  // var parameters = {
  //   distance: 400,
  //   inclination: 0.51,
  //   azimuth: 0.205
  // };
  //
  // var cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512, {
  //   format: THREE.RGBFormat,
  //   generateMipmaps: true,
  //   minFilter: THREE.LinearMipmapLinearFilter
  // });
  // var cubeCamera = new THREE.CubeCamera(0.1, 1, cubeRenderTarget);
  //
  // scene.background = cubeRenderTarget;
  //
  // function updateSun() {
  //
  //   var theta = Math.PI * (parameters.inclination - 0.5);
  //   var phi = 2 * Math.PI * (parameters.azimuth - 0.5);
  //
  //   light.position.x = parameters.distance * Math.cos(phi);
  //   light.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta);
  //   light.position.z = parameters.distance * Math.sin(phi) * Math.cos(theta);
  //
  //   sky.material.uniforms['sunPosition'].value = light.position.copy(light.position);
  //   water.material.uniforms['sunDirection'].value.copy(light.position).normalize();
  //
  //   cubeCamera.update(renderer, sky);
  // }
  //
  // updateSun();



  // controls = new OrbitControls(camera, renderer.domElement);
  // controls.maxPolarAngle = Math.PI * 0.495;
  // controls.target.set(0, 10, 0);
  // controls.minDistance = 40.0;
  // controls.maxDistance = 200.0;
  // controls.update();

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);

}

function animate() {
  requestAnimationFrame(animate);
  render();
  // stats.update();
}

function render() {
  camera.position.x += (mouseX - camera.position.x) * .05;
  camera.position.y += (-mouseY - camera.position.y) * .05;
  camera.position.y = Math.max(camera.position.y, 10);

  // console.log(camera.position.y);
  camera.lookAt(scene.position);

  var time = Date.now() * 0.001;


  for (var i = 0, il = spheres.length; i < il; i++) {
    var sphere = spheres[i];
    sphere.position.y = Math.sin(time + i) * 20 + i;
    // sphere.position.x = Math.cos(time + i);

    // sphere.position.x = 100 * Math.cos( time + i );
    // sphere.position.y = 100 * Math.sin( time + i * 1.1 );
  }
  water.material.uniforms['time'].value += 1.0 / 60.0;
  renderer.render(scene, camera);
}

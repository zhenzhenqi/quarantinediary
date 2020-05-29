import * as THREE from './three/three.module.js';

import {
  OrbitControls
} from './three/OrbitControls.js';
import {
  Water
} from './three/Water.js';
import {
  Sky
} from './three/Sky.js';

var container, stats;
var camera, scene, renderer, light;
var controls, water, avatar;

init();
animate();

function init() {

  container = document.getElementById('myContainer');

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);


  scene = new THREE.Scene();


  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
  camera.position.set(30, 30, 100);


  light = new THREE.DirectionalLight(0xffffff, 0.8);
  scene.add(light);


  var waterGeometry = new THREE.PlaneBufferGeometry(10000, 10000);

  water = new Water(
    waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load('./three/waternormals.jpg', function(texture) {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      }),
      alpha: 1.0,
      sunDirection: light.position.clone().normalize(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined
    }
  );

  water.rotation.x = -Math.PI / 2;

  scene.add(water);

  // Skybox

  var sky = new Sky();

  var uniforms = sky.material.uniforms;

  uniforms['turbidity'].value = 10;
  uniforms['rayleigh'].value = 2;
  uniforms['luminance'].value = 1;
  uniforms['mieCoefficient'].value = 0.005;
  uniforms['mieDirectionalG'].value = 0.8;

  var parameters = {
    distance: 400,
    inclination: 0.51,
    azimuth: 0.205
  };

  var cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter
  });
  var cubeCamera = new THREE.CubeCamera(0.1, 1, cubeRenderTarget);

  scene.background = cubeRenderTarget;

  function updateSun() {

    var theta = Math.PI * (parameters.inclination - 0.5);
    var phi = 2 * Math.PI * (parameters.azimuth - 0.5);

    light.position.x = parameters.distance * Math.cos(phi);
    light.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta);
    light.position.z = parameters.distance * Math.sin(phi) * Math.cos(theta);

    sky.material.uniforms['sunPosition'].value = light.position.copy(light.position);
    water.material.uniforms['sunDirection'].value.copy(light.position).normalize();

    cubeCamera.update(renderer, sky);

  }

  updateSun();

  //

  var geometry = new THREE.IcosahedronBufferGeometry(20, 1);
  var count = geometry.attributes.position.count;

  var colors = [];
  var color = new THREE.Color();

  for (var i = 0; i < count; i += 3) {

    color.setHex(Math.random() * 0xffffff);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);

  }

  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  var material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.0,
    flatShading: true,
    envMap: cubeRenderTarget.texture,
    side: THREE.DoubleSide
  });

  avatar = new THREE.Mesh(geometry, material);
  scene.add(avatar);

  //

  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set(0, 10, 0);
  controls.minDistance = 40.0;
  controls.maxDistance = 200.0;
  controls.update();

  //

  // stats = new Stats();
  // container.appendChild( stats.dom );

  // GUI

  // var gui = new GUI();
  //
  // var folder = gui.addFolder( 'Sky' );
  // folder.add( parameters, 'inclination', 0, 0.5, 0.0001 ).onChange( updateSun );
  // folder.add( parameters, 'azimuth', 0, 1, 0.0001 ).onChange( updateSun );
  // folder.open();
  //
  // var uniforms = water.material.uniforms;
  //
  // var folder = gui.addFolder( 'Water' );
  // folder.add( uniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
  // folder.add( uniforms.size, 'value', 0.1, 10, 0.1 ).name( 'size' );
  // folder.add( uniforms.alpha, 'value', 0.9, 1, .001 ).name( 'alpha' );
  // folder.open();

  //

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
  requestAnimationFrame(animate);
  render();
  // stats.update();

}

function render() {

  var time = performance.now() * 0.001;

  avatar.position.y = Math.sin(time) * 20 + 5;
  avatar.rotation.x = time * 0.5;
  avatar.rotation.z = time * 0.51;

  water.material.uniforms['time'].value += 1.0 / 60.0;

  renderer.render(scene, camera);

}

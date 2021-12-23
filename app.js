import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import _fragment from "./shaders/fragment.glsl";
import _vertex from "./shaders/vertex.glsl";

import texture from "./images/tex1.jpg";

// SIZES
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
document.getElementById("canvas-container").appendChild(renderer.domElement);
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor(0xffffff);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 1;
scene.add(camera);

// Geometry (Obj's )
const geometry = new THREE.PlaneBufferGeometry(0.8, 0.5);

// uniforms for shader-material
const uniforms = {
  u_sphereColor: { type: "v2", value: new THREE.Vector3(1, 0, 0) },
  u_time: { type: "f", value: 1.0 },
  u_resolution: {
    type: "v2",
    value: new THREE.Vector2(sizes.width, sizes.height),
  },
  image: { type: "t", value: new THREE.TextureLoader().load(texture) },
  // u_mouse: { type: "v2", value: new THREE.Vector2(500, 500) },
};

// Materials (Obj's)
const material = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: uniforms,
  fragmentShader: _fragment,
  vertexShader: _vertex,
});

// Mesh (Obj)
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

//Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// ANIMATE
// const clock = new THREE.Clock();
// let totalTime = 0.0;
const tick = () => {
  // const elapsedTime = clock.getElapsedTime();
  // totalTime += elapsedTime * 0.00001;

  uniforms.u_time.value += 0.04;

  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

//Event Listeners
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update uniforms.u_resolution
  uniforms.u_resolution.value.x = sizes.width;
  uniforms.u_resolution.value.y = sizes.height;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

// window.addEventListener("mousemove", (e) => {
//   uniforms.u_mouse.value.x = e.pageX;
//   uniforms.u_mouse.value.y = e.pageY;
// });

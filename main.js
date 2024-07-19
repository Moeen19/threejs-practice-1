import * as THREE from "three";
const canvas = document.getElementById("WebGl");
import "./style.css";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// scene
const scene = new THREE.Scene();

// geometry
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// material
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
});

// combination of geometry and material: mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// light
const light = new THREE.PointLight(0xffffff);
light.position.set(0, 0, 20);
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(light, ambientLight);

// helper
const pointLightHelper = new THREE.PointLightHelper(light);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(pointLightHelper, gridHelper);

// scene camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 40;
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2)
renderer.render(scene, camera);

// background
const space = new THREE.TextureLoader().load("space.jpg");
scene.background = space;

// Resize
window.addEventListener("resize", () => {
  // Update the sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update the camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// addStar
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

// add 200 stars to the scene
Array(200).fill().forEach(addStar);

// moon texture, normal texture, jeff texture
const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");
const jeffTexture = new THREE.TextureLoader().load("jeff.png");

// jef
const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshStandardMaterial({
    map: jeffTexture,
    color: 0xffffff,
  })
);
scene.add(jeff);

// moon
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshBasicMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
moon.position.z = 30;
moon.position.x = -10;
scene.add(moon);

// scroll animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
// controls.autoRotate = true
// controls.autoRotateSpeed = 10
controls.enablePan = false
controls.enableZoom = false

function animate() {
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
  controls.update();
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.005;
  mesh.rotation.z += 0.01;
}

animate();

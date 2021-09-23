import '../scss/app.scss';
import * as THREE from 'three';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//Animate On Scroll
import * as AOS from 'aos/dist/aos.js';



// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 32, 100);
const material = new THREE.PointsMaterial({
  size: 0.05
});
const torus = new THREE.Points(geometry, material);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);


const getRandomParticelPos = (particleCount) => {
  const arr = new Float32Array(particleCount * 2);
  for (let i = 0; i < particleCount; i++) {
    arr[i] = (Math.random() - 0.5) * 8;
  }
  return arr;
};
function addStar() {

  const geometrys = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];

  geometrys[0].setAttribute(
    "position",
    new THREE.BufferAttribute(getRandomParticelPos(150), 3)
  );
  geometrys[1].setAttribute(
    "position",
    new THREE.BufferAttribute(getRandomParticelPos(150), 3)
  );

  const loader = new THREE.TextureLoader();

  // material
  const materials = [
    new THREE.PointsMaterial({
      size: 0.05,
      map: loader.load(
        "https://raw.githubusercontent.com/Kuntal-Das/textures/main/sp1.png"
      ),
      transparent: true
      // color: "#ff0000"
    }),
    new THREE.PointsMaterial({
      size: 0.075,
      map: loader.load(
        "https://raw.githubusercontent.com/Kuntal-Das/textures/main/sp2.png"
      ),
      transparent: true
      // color: "#0000ff"
    })
  ];


  const starsT1 = new THREE.Points(geometrys[0], materials[0]);
  const starsT2 = new THREE.Points(geometrys[1], materials[1]);

  /*   const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshPhongMaterial ({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
   */
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  starsT1.position.set(x, y, z);
  starsT2.position.set(x, y, z);
  scene.add(starsT1);
  scene.add(starsT2);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('../images/content/space.jpg');
scene.background = spaceTexture;

// Avatar

const jeffTexture = new THREE.TextureLoader().load('./images/content/jeff.png');

const jeff = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ map: jeffTexture }));

scene.add(jeff);

// Moon

const moonTexture = new THREE.TextureLoader().load('./images/content/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('./images/content/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 46;
moon.position.setX(-10);

jeff.position.z = -5;
jeff.position.x = 3;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.002;
  torus.rotation.y += 0.001;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();


// AOS


AOS.init({
  easing: 'ease-in-sine',
  delay: 50,
  once: true,
  anchorPlacement: 'top-center'
});
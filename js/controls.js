import * as THREE from "three";
import { scene, camera, renderer } from "./sceneSetup";
import { keyboard } from "./keyboard";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const leftBoundary = -250;
const rightBoundary = 250;
const finishLineDistance = -15000;
// const maxTiltAngle = THREE.MathUtils.degToRad(10);
let gameRunning = true;

const loader = new GLTFLoader();
let car;

function loadCarModel() {
  loader.load(
    "assets/car/scene.gltf",
    function (gltf) {
      car = gltf.scene;
      car.scale.set(40, 40, 40);
      car.position.set(0, 7, 0);
      car.rotation.y = 7.85;

      scene.add(car);
    },
    undefined,
    function (error) {
      console.error("An error happened while loading the car model:", error);
    }
  );
}

loadCarModel();

const clock = new THREE.Clock();

export function setupControls() {
  addBoundaryStripes();
  addMiddleLines();
  animate();
}

function updateMovement() {
  if (!car) return;

  const targetRotationY = Math.PI;

  const delta = clock.getDelta();
  const moveDistance = 200 * delta;

  car.position.z -= moveDistance;

  if (keyboard.pressed("arrowup") || keyboard.pressed("w")) {
    car.position.z -= moveDistance;
  }
  if (keyboard.pressed("arrowdown") || keyboard.pressed("s")) {
    car.position.z += moveDistance;
  }

  if (keyboard.pressed("arrowleft") || keyboard.pressed("a")) {
    car.position.x = Math.max(car.position.x - moveDistance, leftBoundary);
  } else if (keyboard.pressed("arrowright") || keyboard.pressed("d")) {
    car.position.x = Math.min(car.position.x + moveDistance, rightBoundary);
  }

  camera.position.set(
    car.position.x,
    car.position.y + 100,
    car.position.z + 300
  );
  camera.lookAt(car.position.x, car.position.y, car.position.z - 100);

  window.addEventListener("resize", onWindowResize, false);

  if (car.position.z <= finishLineDistance) {
    stopGame();
  }
}
function animate() {
  if (gameRunning) {
    requestAnimationFrame(animate);
    updateMovement();

    renderer.render(scene, camera);
  }
}

function stopGame() {
  gameRunning = false;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function addBoundaryStripes() {
  const segmentLength = 100;
  const stripeWidth = 35;
  const totalLength = Math.abs(finishLineDistance);

  function addStripesForSide(side) {
    let currentZ = 0;
    while (currentZ < totalLength) {
      const whiteGeometry = new THREE.PlaneGeometry(stripeWidth, segmentLength);
      const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const whiteStripe = new THREE.Mesh(whiteGeometry, whiteMaterial);
      whiteStripe.position.set(side, 0.1, -currentZ);
      whiteStripe.rotateX(-Math.PI / 2);
      scene.add(whiteStripe);

      currentZ += segmentLength;

      const redGeometry = new THREE.PlaneGeometry(stripeWidth, segmentLength);
      const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const redStripe = new THREE.Mesh(redGeometry, redMaterial);
      redStripe.position.set(side, 0.1, -currentZ);
      redStripe.rotateX(-Math.PI / 2);
      scene.add(redStripe);

      currentZ += segmentLength;
    }
  }

  addStripesForSide(leftBoundary + stripeWidth / 2);
  addStripesForSide(rightBoundary - stripeWidth / 2);
}

function addMiddleLines() {
  const dashLength = 40;
  const gapLength = 30;
  const lineThickness = 4;
  const lineColor = 0xffffff;
  const totalLength = Math.abs(finishLineDistance);

  for (let z = 0; z < totalLength; z += dashLength + gapLength) {
    const dashGeometry = new THREE.PlaneGeometry(lineThickness, dashLength);
    dashGeometry.rotateX(-Math.PI / 2);
    const dashMaterial = new THREE.MeshBasicMaterial({ color: lineColor });
    const dash = new THREE.Mesh(dashGeometry, dashMaterial);
    dash.position.set(0, 0.1, -z - dashLength / 2);
    scene.add(dash);
  }
}

import * as THREE from "three";
import { scene, camera, renderer } from "./sceneSetup";
import { keyboard } from "./keyboard";

const leftBoundary = -250;
const rightBoundary = 250;
const finishLineDistance = -15000;
const maxTiltAngle = THREE.MathUtils.degToRad(10);
let gameRunning = true;

const cubeGeometry = new THREE.BoxGeometry(50, 25, 60);
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 25, -20);

scene.add(cube);

const clock = new THREE.Clock();

export function setupControls() {
  addBoundaryStripes();
  addMiddleLines();
  animate();
}

function updateMovement() {
  const delta = clock.getDelta();
  const moveDistance = 200 * delta;

  cube.position.z -= moveDistance;

  if (keyboard.pressed("arrowup") || keyboard.pressed("w")) {
    cube.position.z -= moveDistance;
  }
  if (keyboard.pressed("arrowdown") || keyboard.pressed("s")) {
    cube.position.z += moveDistance;
  }

  if (keyboard.pressed("arrowleft") || keyboard.pressed("a")) {
    cube.position.x = Math.max(cube.position.x - moveDistance, leftBoundary);
    cube.rotation.z = Math.min(cube.rotation.z + delta, maxTiltAngle);
  } else if (keyboard.pressed("arrowright") || keyboard.pressed("d")) {
    cube.position.x = Math.min(cube.position.x + moveDistance, rightBoundary);
    cube.rotation.z = Math.max(cube.rotation.z - delta, -maxTiltAngle);
  } else {
    if (cube.rotation.z < 0) {
      cube.rotation.z = Math.min(cube.rotation.z + delta, 0);
    } else if (cube.rotation.z > 0) {
      cube.rotation.z = Math.max(cube.rotation.z - delta, 0);
    }
  }

  camera.position.set(
    cube.position.x,
    cube.position.y + 100,
    cube.position.z + 300
  );
  camera.lookAt(cube.position.x, cube.position.y, cube.position.z - 100);

  window.addEventListener("resize", onWindowResize, false);

  if (cube.position.z <= finishLineDistance) {
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

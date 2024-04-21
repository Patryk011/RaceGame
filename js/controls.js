import * as THREE from "three";
import { scene, camera, renderer } from "./sceneSetup";
import { keyboard } from "./keyboard";

const leftBoundary = -200;
const rightBoundary = 200;
const finishLineDistance = -10000;
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
  addBoundaryLines();

  animate();
}

function updateMovement() {
  const delta = clock.getDelta();
  const moveDistance = 150 * delta;

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

function addBoundaryLines() {
  const boundaryMaterial = new THREE.LineDashedMaterial({
    color: 0x0000ff,
    dashSize: 3,
    gapSize: 1,
    scale: 1,
  });

  const pointsLeft = [];
  pointsLeft.push(new THREE.Vector3(leftBoundary, 0.1, 0));
  pointsLeft.push(new THREE.Vector3(leftBoundary, 0.1, finishLineDistance));

  const geometryLeft = new THREE.BufferGeometry().setFromPoints(pointsLeft);
  const lineLeft = new THREE.LineSegments(geometryLeft, boundaryMaterial);
  lineLeft.computeLineDistances();
  scene.add(lineLeft);

  const pointsRight = [];
  pointsRight.push(new THREE.Vector3(rightBoundary, 0.1, 0));
  pointsRight.push(new THREE.Vector3(rightBoundary, 0.1, finishLineDistance));

  const geometryRight = new THREE.BufferGeometry().setFromPoints(pointsRight);
  const lineRight = new THREE.LineSegments(geometryRight, boundaryMaterial);
  lineRight.computeLineDistances();
  scene.add(lineRight);
}

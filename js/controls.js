import * as THREE from "three";
import { scene, camera, renderer } from "./sceneSetup";
import { keyboard } from "./keyboard";
// import { createTerrain } from "./terrain";

// const ground = createTerrain();
const leftBoundary = -200;
const rightBoundary = 200;
const finishLineDistance = -100000;
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
  addLines();
  animate();
}

function updateMovement() {
  const delta = clock.getDelta();
  const moveDistance = 150 * delta;

  cube.position.z -= moveDistance;

  if (keyboard.pressed("arrowleft") || keyboard.pressed("a")) {
    cube.position.x = Math.max(cube.position.x - moveDistance, -270);
  }
  if (keyboard.pressed("arrowright") || keyboard.pressed("d")) {
    cube.position.x = Math.min(cube.position.x + moveDistance, 270);
  }
  if (keyboard.pressed("arrowup") || keyboard.pressed("w")) {
    cube.position.z -= moveDistance;
  }
  if (keyboard.pressed("arrowdown") || keyboard.pressed("s")) {
    cube.position.z += moveDistance;
  }

  camera.position.set(
    cube.position.x,
    cube.position.y + 100,
    cube.position.z + 300
  );
  camera.lookAt(cube.position.x, cube.position.y, cube.position.z - 100);

  // const speed = moveDistance / ground.geometry.parameters.width;
  // ground.material.map.offset.y += speed * delta;

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

function addBoundaryLines() {
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const points = [];

  points.push(new THREE.Vector3(leftBoundary, 0, 0));
  points.push(new THREE.Vector3(leftBoundary, 0, finishLineDistance));

  const geometryLeft = new THREE.BufferGeometry().setFromPoints(points);

  const lineLeft = new THREE.Line(geometryLeft, material);
  scene.add(lineLeft);

  points[0].set(rightBoundary, 0, 0);
  points[1].set(rightBoundary, 0, finishLineDistance);

  const geometryRight = new THREE.BufferGeometry().setFromPoints(points);

  const lineRight = new THREE.Line(geometryRight, material);
  scene.add(lineRight);
}

function addLines() {
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const finishLineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(leftBoundary, 0, finishLineDistance),
    new THREE.Vector3(rightBoundary, 0, finishLineDistance),
  ]);
  const finishLine = new THREE.Line(finishLineGeometry, material);
  scene.add(finishLine);

  const roadLineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0.1, 0),
    new THREE.Vector3(0, 0.1, finishLineDistance),
  ]);

  const leftRoadLine = new THREE.Line(roadLineGeometry, material);
  leftRoadLine.position.x = leftBoundary / 2;
  scene.add(leftRoadLine);

  const rightRoadLine = new THREE.Line(roadLineGeometry, material);
  rightRoadLine.position.x = rightBoundary / 2;
  scene.add(rightRoadLine);
}

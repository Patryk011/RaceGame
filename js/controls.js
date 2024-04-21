import * as THREE from "three";
import { scene, camera, renderer } from "./sceneSetup";
import { keyboard } from "./keyboard";

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

  camera.position.x = cube.position.x;
  camera.position.y = cube.position.y + 100;
  camera.position.z = cube.position.z + 100;

  camera.lookAt(cube.position);
}
function animate() {
  requestAnimationFrame(animate);
  updateMovement();

  renderer.render(scene, camera);
}

import * as THREE from "three";
import { scene } from "./sceneSetup";

const cubeGeometry = new THREE.BoxGeometry();

const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 0.5;
scene.add(cube);

export function setupControls() {
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        cube.position.z -= 0.1;
        break;
      case "ArrowDown":
        cube.position.z += 0.1;
        break;
      case "ArrowLeft":
        cube.position.x -= 0.1;
        break;
      case "ArrowRight":
        cube.position.x += 0.1;
        break;
    }
  });
}

import * as THREE from "three";
import { scene } from "./sceneSetup.js";

export function createTerrain() {
  const asphaltMaterial = new THREE.MeshBasicMaterial({ color: 0x676767 });

  const groundGeometry = new THREE.PlaneGeometry(20000, 20000);
  groundGeometry.rotateX(-Math.PI / 2);

  const ground = new THREE.Mesh(groundGeometry, asphaltMaterial);
  ground.position.y = -0.5;
  scene.add(ground);
}

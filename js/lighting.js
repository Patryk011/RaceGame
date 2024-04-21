import * as THREE from "three";
import { scene } from "./sceneSetup.js";

export function setupLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 10, 5);

  scene.add(directionalLight);
}

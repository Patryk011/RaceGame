import * as THREE from "three";
import { scene } from "./sceneSetup.js";

export function createTerrain() {
  const loader = new THREE.TextureLoader();
  const groundTexture = loader.load("/assets/textures/groundTexture.jpg");

  const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    groundMaterial
  );
  ground.rotation.x = -Math.PI / 2;

  scene.add(ground);
}

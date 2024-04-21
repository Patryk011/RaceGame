import * as THREE from "three";
import { scene, setupScene, camera, renderer } from "./sceneSetup.js";
import { createTerrain } from "./terrain.js";
import { setupLights } from "./lighting.js";
import { setupControls } from "./controls.js";
import { setupUI } from "./ui.js";

export function startGame(nickname) {
  console.log(`Starting game for ${nickname}`);
  document.body.appendChild(renderer.domElement);
  createTerrain();
  setupLights();
  setupControls();
  animate();
}

function init() {
  setupScene();
  setupUI();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();

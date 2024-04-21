import * as THREE from "three";
import { scene, setupScene, camera, renderer } from "./sceneSetup.js";
import { createTerrain } from "./terrain.js";
import { setupLights } from "./lighting.js";
import { setupControls } from "./controls.js";

function init() {
  setupScene();
  createTerrain();
  setupLights();
  setupControls();

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();

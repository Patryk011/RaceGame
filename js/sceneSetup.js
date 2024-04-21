import * as THREE from "three";

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
export const renderer = new THREE.WebGLRenderer();

export function setupScene() {
  camera.position.set(0, 5, 10);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

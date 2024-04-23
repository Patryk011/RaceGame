import * as THREE from "three";
import { Sky } from "three/examples/jsm/Addons.js";

export const scene = new THREE.Scene();

let sky = new Sky();
sky.scale.setScalar(30000);
scene.add(sky);

let sun = new THREE.Vector3();

scene.fog = new THREE.Fog(0x000000, 250, 25000);

export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  20000
);
export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;

export function setupScene() {
  camera.position.set(0, 5, 10);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const effectController = {
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    inclination: 0.42,
    azimuth: 0.2,
    exposure: renderer.toneMappingExposure,
  };

  function updateSun() {
    let theta = Math.PI * (effectController.inclination - 0.5);
    let phi = 2 * Math.PI * (effectController.azimuth - 0.5);

    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);

    sky.material.uniforms["sunPosition"].value.copy(sun);
    renderer.toneMappingExposure = effectController.exposure;
  }

  updateSun();
}

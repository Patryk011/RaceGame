import * as THREE from "three";
import { scene } from "./sceneSetup.js";

const leftBoundary = -600;
const rightBoundary = 600;

function createTree(x, z) {
  const trunkGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
  const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(x, 10, z);
  scene.add(trunk);

  const foliageGeometry = new THREE.ConeGeometry(15, 20, 32);
  const foliageMaterial = new THREE.MeshBasicMaterial({ color: 0x228b22 });
  const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
  foliage.position.set(x, 30, z);
  scene.add(foliage);
}

export function createTerrain() {
  const insideMaterial = new THREE.MeshBasicMaterial({ color: 0x676767 });

  const insideGeometry = new THREE.PlaneGeometry(400, 20000);
  insideGeometry.rotateX(-Math.PI / 2);

  const insideGround = new THREE.Mesh(insideGeometry, insideMaterial);
  insideGround.position.y = -0.5;
  scene.add(insideGround);

  const outsideMaterial = new THREE.MeshBasicMaterial({ color: 0x008000 });

  const outsideLeftGeometry = new THREE.PlaneGeometry(20000, 20000);
  outsideLeftGeometry.rotateX(-Math.PI / 2);
  const outsideLeftGround = new THREE.Mesh(
    outsideLeftGeometry,
    outsideMaterial
  );
  outsideLeftGround.position.y = -0.5;
  outsideLeftGround.position.x = -10000 + leftBoundary / 2;
  scene.add(outsideLeftGround);

  const outsideRightGeometry = new THREE.PlaneGeometry(20000, 20000);
  outsideRightGeometry.rotateX(-Math.PI / 2);
  const outsideRightGround = new THREE.Mesh(
    outsideRightGeometry,
    outsideMaterial
  );
  outsideRightGround.position.y = -0.5;
  outsideRightGround.position.x = 10000 + rightBoundary / 2;
  scene.add(outsideRightGround);

  for (let i = 0; i < 50; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(20000);
    if (Math.abs(x) > 400) {
      createTree(x, z);
    }
  }
}

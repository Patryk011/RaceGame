import * as THREE from "three";
import { scene } from "./sceneSetup.js";

const leftBoundary = -250;
const rightBoundary = 250;
const leftTreeZoneStart = leftBoundary - 6000;
const leftTreeZoneEnd = leftBoundary;
const rightTreeZoneStart = rightBoundary;
const rightTreeZoneEnd = rightBoundary + 6000;
const numberOfTrees = 50;

function createTree(x, z) {
  const trunkHeight = THREE.MathUtils.randFloat(40, 80);
  const trunkRadius = THREE.MathUtils.randFloat(5, 10);
  const foliageHeight = THREE.MathUtils.randFloat(40, 80);
  const foliageRadius = THREE.MathUtils.randFloat(20, 40);

  const trunkGeometry = new THREE.CylinderGeometry(
    trunkRadius,
    trunkRadius,
    trunkHeight,
    32
  );
  const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(x, trunkHeight / 2, z);
  scene.add(trunk);

  const foliageGeometry = new THREE.ConeGeometry(
    foliageRadius,
    foliageHeight,
    32
  );
  const foliageMaterial = new THREE.MeshBasicMaterial({ color: 0x228b22 });
  const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
  foliage.position.set(x, trunkHeight + foliageHeight / 2, z);
  scene.add(foliage);
}

for (let i = 0; i < numberOfTrees; i++) {
  let x,
    z = THREE.MathUtils.randFloatSpread(30000);

  if (Math.random() < 0.5) {
    x = THREE.MathUtils.randFloat(leftTreeZoneStart, leftTreeZoneEnd);
  } else {
    x = THREE.MathUtils.randFloat(rightTreeZoneStart, rightTreeZoneEnd);
  }
  createTree(x, z);
}

export function createTerrain() {
  const loader = new THREE.TextureLoader();

  const asphaltTexture = loader.load("assets/textures/asphalt.jpg");
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(1, 20);

  const insideMaterial = new THREE.MeshBasicMaterial({ map: asphaltTexture });

  const insideGeometry = new THREE.PlaneGeometry(
    rightBoundary - leftBoundary,
    30000
  );
  insideGeometry.rotateX(-Math.PI / 2);

  const insideGround = new THREE.Mesh(insideGeometry, insideMaterial);
  insideGround.position.y = -0.5;
  scene.add(insideGround);

  const grassTexture = loader.load("assets/textures/grass.jpg");
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(50, 50);

  const outsideMaterial = new THREE.MeshBasicMaterial({ map: grassTexture });

  const outsideLeftGeometry = new THREE.PlaneGeometry(10000, 30000);
  outsideLeftGeometry.rotateX(-Math.PI / 2);
  const outsideLeftGround = new THREE.Mesh(
    outsideLeftGeometry,
    outsideMaterial
  );
  outsideLeftGround.position.y = -0.5;
  outsideLeftGround.position.x = leftBoundary - 5000;
  scene.add(outsideLeftGround);

  const outsideRightGeometry = new THREE.PlaneGeometry(10000, 30000);
  outsideRightGeometry.rotateX(-Math.PI / 2);
  const outsideRightGround = new THREE.Mesh(
    outsideRightGeometry,
    outsideMaterial
  );
  outsideRightGround.position.y = -0.5;
  outsideRightGround.position.x = rightBoundary + 5000;
  scene.add(outsideRightGround);
}

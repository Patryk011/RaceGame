import * as THREE from "three";
import { scene, camera, renderer } from "./sceneSetup";
import { keyboard } from "./keyboard";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gameFinished } from "./main";
import { ResourceTracker } from "./resourceTracker";

const resourceTracker = new ResourceTracker();

const leftBoundary = -250;
const rightBoundary = 250;
const finishLineDistance = -17500;
let gameRunning = true;
let score = 0;
let startTime = 0;
let endTime = 0;
let isStopped = false;

let car;
let obstacles = [];
let swayAngle = 0;
const swaySpeed = 2;
const maxSwayAngle = 0.05;

function loadCarModel() {
  const gltfLoader = new GLTFLoader();
  resourceTracker.track(gltfLoader);

  gltfLoader.load(
    "assets/car/scene.gltf",
    function (gltf) {
      car = gltf.scene;
      car.scale.set(30, 30, 30);
      car.position.set(0, 15, 0);
      car.rotation.y = 9.39;

      car.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.geometry.computeBoundingBox();
          child.geometry.boundingBox.applyMatrix4(child.matrixWorld);
        }
      });

      scene.add(car);
      resourceTracker.track(car);
    },
    undefined,
    function (error) {
      console.error("An error happened while loading the car model:", error);
    }
  );
}

function updateScoreDisplay() {
  const scoreElement = document.getElementById("score-display");
  scoreElement.textContent = `Score: ${Math.round(score)}`;
}

loadCarModel();

const clock = new THREE.Clock();
resourceTracker.track(clock);

export function setupControls() {
  addBoundaryStripes();
  addMiddleLines();
  addFinishLine();
  addObstacles();
  animate();
}

export function startGameControls() {
  gameRunning = true;
  startTime = performance.now();
  animate();
}

function updateMovement() {
  if (!car) return;

  const delta = clock.getDelta();
  const moveDistance = 200 * delta;

  car.position.z -= moveDistance;

  let swaying = false;

  if (keyboard.pressed("arrowup") || keyboard.pressed("w")) {
    car.position.z -= moveDistance;
    isStopped = false;
  } else if (keyboard.pressed("arrowdown") || keyboard.pressed("s")) {
    car.position.z += moveDistance;
    isStopped = true;
  } else {
    isStopped = false;
  }

  if (keyboard.pressed("arrowleft") || keyboard.pressed("a")) {
    car.position.x = Math.max(car.position.x - moveDistance, leftBoundary);
    swayAngle = Math.max(swayAngle - delta * swaySpeed, -maxSwayAngle);
    swaying = true;
  } else if (keyboard.pressed("arrowright") || keyboard.pressed("d")) {
    car.position.x = Math.min(car.position.x + moveDistance, rightBoundary);
    swayAngle = Math.min(swayAngle + delta * swaySpeed, maxSwayAngle);
    swaying = true;
  }

  if (!swaying) {
    if (swayAngle > 0) {
      swayAngle = Math.max(swayAngle - delta * swaySpeed, 0);
    } else {
      swayAngle = Math.min(swayAngle + delta * swaySpeed, 0);
    }
  }

  car.rotation.z = swayAngle;

  if (!isStopped) {
    score += moveDistance;
  }

  camera.position.set(
    car.position.x,
    car.position.y + 100,
    car.position.z + 300
  );
  camera.lookAt(car.position.x, car.position.y, car.position.z - 100);

  window.addEventListener("resize", onWindowResize, false);

  if (car.position.z <= finishLineDistance) {
    stopGame();
  }
  updateScoreDisplay();

  checkCollisions();
}

function animate() {
  if (gameRunning) {
    requestAnimationFrame(animate);
    updateMovement();
    renderer.render(scene, camera);
  }
}

function stopGame() {
  gameRunning = false;
  endTime = performance.now();
  const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
  const finalScore = {
    time: parseFloat(timeTaken),
    distance: Math.round(score),
  };
  gameFinished(finalScore);
  gameFinished;
}

export function resetGameEnvironment() {
  score = 0;
  startTime = 0;
  endTime = 0;
  if (car) {
    car.position.set(0, 15, 0);
  }
  updateScoreDisplay();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function addBoundaryStripes() {
  const segmentLength = 100;
  const stripeWidth = 35;
  const totalLength = Math.abs(finishLineDistance) * 1.5;

  function addStripesForSide(side) {
    let currentZ = 0;
    while (currentZ < totalLength) {
      const whiteGeometry = new THREE.PlaneGeometry(stripeWidth, segmentLength);
      const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const whiteStripe = new THREE.Mesh(whiteGeometry, whiteMaterial);
      whiteStripe.position.set(side, 0.1, -currentZ);
      whiteStripe.rotateX(-Math.PI / 2);
      scene.add(whiteStripe);
      resourceTracker.track(whiteStripe);

      currentZ += segmentLength;

      const redGeometry = new THREE.PlaneGeometry(stripeWidth, segmentLength);
      const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const redStripe = new THREE.Mesh(redGeometry, redMaterial);
      redStripe.position.set(side, 0.1, -currentZ);
      redStripe.rotateX(-Math.PI / 2);
      scene.add(redStripe);
      resourceTracker.track(redStripe);

      currentZ += segmentLength;
    }
  }

  addStripesForSide(leftBoundary + stripeWidth / 2);
  addStripesForSide(rightBoundary - stripeWidth / 2);
}

function addMiddleLines() {
  const dashLength = 40;
  const gapLength = 30;
  const lineThickness = 4;
  const lineColor = 0xffffff;
  const totalLength = Math.abs(finishLineDistance) * 1.5;

  for (let z = 0; z < totalLength; z += dashLength + gapLength) {
    const dashGeometry = new THREE.PlaneGeometry(lineThickness, dashLength);
    dashGeometry.rotateX(-Math.PI / 2);
    const dashMaterial = new THREE.MeshBasicMaterial({ color: lineColor });
    const dash = new THREE.Mesh(dashGeometry, dashMaterial);
    dash.position.set(0, 0.1, -z - dashLength / 2);
    scene.add(dash);
    resourceTracker.track(dash);
  }
}

function addFinishLine() {
  const finishLineGeometry = new THREE.PlaneGeometry(
    rightBoundary - leftBoundary,
    10
  );
  const finishLineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const finishLine = new THREE.Mesh(finishLineGeometry, finishLineMaterial);
  finishLine.position.set(0, 0.1, finishLineDistance);
  finishLine.rotateX(-Math.PI / 2);
  scene.add(finishLine);
  resourceTracker.track(finishLine);
}

function addObstacles() {
  const obstacleGeometry = new THREE.BoxGeometry(20, 20, 20);
  const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  for (let i = 0; i < 10; i++) {
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set(
      THREE.MathUtils.randFloat(leftBoundary, rightBoundary),
      10,
      -Math.random() * Math.abs(finishLineDistance)
    );

    obstacle.geometry.computeBoundingBox();

    scene.add(obstacle);
    obstacles.push(obstacle);
    resourceTracker.track(obstacle);

    const boxHelper = new THREE.BoxHelper(obstacle, 0xff0000);
    scene.add(boxHelper);
    resourceTracker.track(boxHelper);
  }
}

// Check collisions
function checkCollisions() {
  if (!car) return;

  const carBox = new THREE.Box3(
    new THREE.Vector3(
      car.position.x - 15,
      car.position.y - 7,
      car.position.z - 10
    ),
    new THREE.Vector3(
      car.position.x + 15,
      car.position.y + 7,
      car.position.z + 10
    )
  );

  for (let i = 0; i < obstacles.length; i++) {
    const obstacleBox = new THREE.Box3().setFromObject(obstacles[i]);

    if (carBox.intersectsBox(obstacleBox)) {
      stopGame();
      return;
    }
  }
}

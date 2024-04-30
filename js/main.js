import * as THREE from "three";
import { scene, setupScene, camera, renderer } from "./sceneSetup.js";
import { createTerrain } from "./terrain.js";
import { setupLights } from "./lighting.js";
import { setupControls, updateScoreDisplay } from "./controls.js";
import { setupUI } from "./ui.js";

let players = [];
let currentPlayerIndex = 0;

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

export function registerPlayer(nickname) {
  const player = {
    name: nickname,
    score: 0,
    finished: false,
  };
  players.push(player);
  updateScoreboard();
}

export function startNextPlayer() {
  if (currentPlayerIndex < players.length) {
    const playerName = players[currentPlayerIndex].name;
    console.log(`Starting game for ${playerName}`);
    startGame(playerName);
    currentPlayerIndex++;
  } else {
    console.log("No more players in the queue");
  }
}

function updateScoreboard() {
  const scoreboardElement = document.querySelector("#scoreboard table");
  scoreboardElement.innerHTML = "<tr><th>Player</th><th>Score</th></tr>";
  players.forEach((player) => {
    const row = `<tr><td>${player.name}</td><td>${player.score}</td></tr>`;
    scoreboardElement.innerHTML += row;
  });
}

init();

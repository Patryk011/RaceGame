// main.js
import * as THREE from "three";
import { scene, setupScene, camera, renderer } from "./sceneSetup.js";
import { createTerrain } from "./terrain.js";
import { setupLights } from "./lighting.js";
import { setupControls } from "./controls.js";
import { setupUI } from "./ui.js";

export let players = [];
let currentPlayerIndex = 0;

export function registerPlayer(nickname, totalPlayers) {
  const player = {
    name: nickname,
    score: 0,
    finished: false,
  };
  players.push(player);
  updateScoreboard();
  if (players.length === totalPlayers) {
    console.log("All players registered. Ready to start!");
  }
}

export function startNextPlayer() {
  if (
    currentPlayerIndex < players.length &&
    !players[currentPlayerIndex].finished
  ) {
    const playerName = players[currentPlayerIndex].name;
    console.log(`Starting game for ${playerName}`);
    startGame(playerName);
  } else {
    console.log("All players have played or game queue is complete.");
  }
}

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

export function gameFinished() {
  players[currentPlayerIndex].finished = true;
  updateScoreboard();
  currentPlayerIndex++;
  if (currentPlayerIndex < players.length) {
    startNextPlayer();
  } else {
    console.log("Game over. Displaying final scores.");
    displayScores();
  }
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
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

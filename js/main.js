import * as THREE from "three";
import { scene, setupScene, camera, renderer } from "./sceneSetup.js";
import { createTerrain } from "./terrain.js";
import { setupLights } from "./lighting.js";
import {
  setupControls,
  resetGameEnvironment,
  startGameControls,
} from "./controls.js";
import { setupUI } from "./ui.js";
import { ResourceTracker } from "./resourceTracker";

const resourceTracker = new ResourceTracker();
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
    startGame(playerName);
  } else {
    console.log("All players have played or game queue is complete.");
  }
}

export function nameDisplay(nickname) {
  const name = document.getElementById("username-display");
  name.textContent = `Starting game for ${nickname}`;
  setTimeout(() => {
    name.textContent = "";
  }, 5000);
}

export function startGame(nickname) {
  resourceTracker.dispose();
  nameDisplay(nickname);
  resetGameEnvironment();
  startGameControls();
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
  resourceTracker.dispose();
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

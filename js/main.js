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
    score: { time: 0, distance: 0 }, // initialize score as an object
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
  setupEventListeners();
}

export function gameFinished(finalScore) {
  players[currentPlayerIndex].score = finalScore;
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
  scoreboardElement.innerHTML =
    "<tr><th>Player</th><th>Time (s)</th><th>Distance</th></tr>";
  players.forEach((player) => {
    const row = `<tr><td>${player.name}</td><td>${player.score.time.toFixed(
      2
    )}</td><td>${player.score.distance}</td></tr>`;
    scoreboardElement.innerHTML += row;
  });
}

function displayScores() {
  const scoreboard = document.getElementById("scoreboard");
  scoreboard.classList.remove("hidden");
  const uiContainer = document.getElementById("ui-container");
  uiContainer.style.display = "none";
  const gameContainer = document.getElementById("game-container");
  gameContainer.style.display = "none"; // Hide game view
  renderer.domElement.style.display = "none"; // Hide the renderer view
}

function setupEventListeners() {
  const scoreButton = document.getElementById("score-button");
  const hideScoreButton = document.getElementById("hide-score-button");
  const resetGameButton = document.getElementById("reset-game-button");

  if (scoreButton) {
    scoreButton.addEventListener("click", () => {
      displayScores();
    });
  }

  if (hideScoreButton) {
    hideScoreButton.addEventListener("click", () => {
      const scoreboard = document.getElementById("scoreboard");
      scoreboard.classList.add("hidden");
      const uiContainer = document.getElementById("ui-container");
      uiContainer.style.display = "block";
      const gameContainer = document.getElementById("game-container");
      gameContainer.style.display = "block"; // Show game view
      renderer.domElement.style.display = "block"; // Show the renderer view
    });
  }

  if (resetGameButton) {
    resetGameButton.addEventListener("click", () => {
      resetGame();
    });
  }
}

function resetGame() {
  players = [];
  currentPlayerIndex = 0;
  resetGameEnvironment();
  const scoreboard = document.getElementById("scoreboard");
  scoreboard.classList.add("hidden");
  const uiContainer = document.getElementById("ui-container");
  uiContainer.style.display = "block";
  const gameContainer = document.getElementById("game-container");
  gameContainer.style.display = "block"; // Show game view
  renderer.domElement.style.display = "block"; // Show the renderer view
}

init();

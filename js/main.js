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
    score: { time: 0, distance: 0 },
    finished: false,
  };
  players.push(player);
  updateScoreboard();
  if (players.length === totalPlayers) {
    console.log("All players registered. Ready to start!");
    const playButton = document.getElementById("play-button");
    if (playButton) playButton.style.display = "block";
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
  const scoreboardElement = document.querySelector("#scoreboard table tbody");
  scoreboardElement.innerHTML = "";
  players.forEach((player) => {
    const row = `<tr><td>${player.name}</td><td>${player.score.time.toFixed(
      2
    )}</td><td>${player.score.distance}</td></tr>`;
    scoreboardElement.innerHTML += row;
  });
}

function displayScores() {
  console.log("displayScores function called");

  updateScoreboard();

  const scoreboard = document.getElementById("scoreboard");
  if (scoreboard) {
    scoreboard.classList.remove("hidden");
    scoreboard.style.display = "flex";
  }

  const uiContainer = document.getElementById("ui-container");
  if (uiContainer) {
    uiContainer.style.display = "none";
    console.log("UI Container is now hidden");
  }

  if (renderer.domElement) {
    renderer.domElement.style.display = "none";
    console.log("Renderer view is now hidden");
  }

  const scoreButton = document.getElementById("score-button");
  if (scoreButton) {
    scoreButton.style.display = "none";
    console.log("Score button is now hidden");
  }

  const hideScoreButton = document.getElementById("hide-score-button");
  if (hideScoreButton) {
    hideScoreButton.style.display = "block";
    console.log("Hide score button is now visible");
  }

  const backToMenuButton = document.getElementById("back-to-menu-button");
  if (backToMenuButton) {
    backToMenuButton.style.display = "block";
    console.log("Back to menu button is now visible");
  }
}

function setupEventListeners() {
  const scoreButton = document.getElementById("score-button");
  const hideScoreButton = document.getElementById("hide-score-button");
  const resetGameButton = document.getElementById("reset-game-button");
  const backToMenuButton = document.getElementById("back-to-menu-button");

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
      gameContainer.style.display = "block";
      if (renderer.domElement) renderer.domElement.style.display = "block";

      hideScoreButton.style.display = "none";
      if (resetGameButton) resetGameButton.style.display = "none";
      if (scoreButton) scoreButton.style.display = "block";
      if (backToMenuButton) backToMenuButton.style.display = "none";
    });
  }

  if (resetGameButton) {
    resetGameButton.addEventListener("click", () => {
      resetGame();
    });
  }

  if (backToMenuButton) {
    backToMenuButton.addEventListener("click", () => {
      const scoreboard = document.getElementById("scoreboard");
      scoreboard.classList.add("hidden");
      const uiContainer = document.getElementById("ui-container");
      uiContainer.style.display = "block";
      const scoreButton = document.getElementById("score-button");
      if (scoreButton) scoreButton.style.display = "block";
      const playButton = document.getElementById("play-button");
      if (playButton) playButton.style.display = "block";
      const resetGameButton = document.getElementById("reset-game-button");
      if (resetGameButton) resetGameButton.style.display = "none";
      const hideScoreButton = document.getElementById("hide-score-button");
      if (hideScoreButton) hideScoreButton.style.display = "none";
      backToMenuButton.style.display = "none";
    });
  }
}

function resetGame() {
  players = [];
  currentPlayerIndex = 0;
  resetGameEnvironment();
  const scoreboard = document.getElementById("scoreboard");
  scoreboard.classList.add("hidden");
  const scoreElement = document.getElementById("score-display");
  scoreElement.textContent = ``;

  const uiContainer = document.getElementById("ui-container");
  uiContainer.style.display = "block";
  const gameContainer = document.getElementById("game-container");
  gameContainer.style.display = "block";
  if (renderer.domElement) renderer.domElement.style.display = "block";

  const scoreButton = document.getElementById("score-button");
  if (scoreButton) scoreButton.style.display = "block";

  const hideScoreButton = document.getElementById("hide-score-button");
  if (hideScoreButton) hideScoreButton.style.display = "none";

  const resetGameButton = document.getElementById("reset-game-button");
  if (resetGameButton) resetGameButton.style.display = "none";

  const backToMenuButton = document.getElementById("back-to-menu-button");
  if (backToMenuButton) backToMenuButton.style.display = "none";
}

init();

import { startGame } from "./main.js";

export function setupUI() {
  const playButton = document.getElementById("play-button");
  const scoreButton = document.getElementById("score-button");
  const nicknameInput = document.getElementById("nickname");
  const hideScoresBtn = document.getElementById("hide-score-button");

  playButton.addEventListener("click", () => {
    const nickname = nicknameInput.value.trim();
    if (!nickname) {
      alert("Please enter a nickname.");
      return;
    }
    startGame(nickname);
    hideUI();
  });

  scoreButton.addEventListener("click", displayScores);
  hideScoresBtn.addEventListener("click", hideScores);
}

function displayScores() {
  const hideScoresBtn = document.getElementById("hide-score-button");
  const scoreboard = document.getElementById("scoreboard");
  scoreboard.classList.remove("hidden");
  hideScoresBtn.classList.remove("hidden");
}

function hideUI() {
  const uiContainer = document.getElementById("ui-container");

  uiContainer.style.display = "none";
}

function hideScores() {
  const scoreboard = document.getElementById("scoreboard");
  const hideScoresBtn = document.getElementById("hide-score-button");

  if (scoreboard.classList.contains("hidden")) return;

  scoreboard.classList.add("hidden");
  hideScoresBtn.classList.add("hidden");
}

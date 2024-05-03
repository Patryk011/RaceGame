import { registerPlayer, startNextPlayer } from "./main.js";

export function setupUI() {
  const setPlayersButton = document.getElementById("set-players-button");
  const addPlayerButton = document.getElementById("add-player-button");
  const playButton = document.getElementById("play-button");
  const nicknameInput = document.getElementById("nickname");
  const playerCountInput = document.getElementById("player-count");

  let totalPlayers = 0;
  let currentPlayerCount = 0;

  setPlayersButton.addEventListener("click", () => {
    totalPlayers = parseInt(playerCountInput.value);
    if (isNaN(totalPlayers) || totalPlayers < 1) {
      alert("Please enter a valid number of players.");
      return;
    }
    nicknameInput.classList.remove("hidden");
    addPlayerButton.classList.remove("hidden");
    setPlayersButton.classList.add("hidden");
    playerCountInput.classList.add("hidden");
  });

  addPlayerButton.addEventListener("click", () => {
    const nickname = nicknameInput.value.trim();
    if (!nickname) {
      alert("Please enter a nickname.");
      return;
    }
    registerPlayer(nickname, totalPlayers);
    currentPlayerCount++;
    nicknameInput.value = "";
    if (currentPlayerCount === totalPlayers) {
      addPlayerButton.classList.add("hidden");
      playButton.classList.remove("hidden");
      nicknameInput.classList.add("hidden");
    }
  });

  playButton.addEventListener("click", () => {
    startNextPlayer();
    hideUI();
  });
}

export function hideUI() {
  const uiContainer = document.getElementById("ui-container");
  uiContainer.style.display = "none";
}

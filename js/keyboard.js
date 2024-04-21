class KeyboardState {
  constructor() {
    this.keys = {};
    document.addEventListener("keydown", (event) => {
      this.keys[event.key.toLowerCase()] = true;
    });
    document.addEventListener("keyup", (event) => {
      this.keys[event.key.toLowerCase()] = false;
    });
  }

  pressed(key) {
    return this.keys[key.toLowerCase()];
  }
}

export const keyboard = new KeyboardState();

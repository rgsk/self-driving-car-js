export class Controls {
  forward: boolean;
  left: boolean;
  right: boolean;
  reverse: boolean;
  constructor() {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;

    this.#addKeyboardListeners();
  }

  #addKeyboardListeners() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          // Left pressed
          this.left = true;
          break;
        case "ArrowRight":
          // Right pressed
          this.right = true;
          break;
        case "ArrowUp":
          // Up pressed
          this.forward = true;
          break;
        case "ArrowDown":
          // Down pressed
          this.reverse = true;
          break;
      }
      //   console.table(this);
    });

    document.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          // Left pressed
          this.left = false;
          break;
        case "ArrowRight":
          // Right pressed
          this.right = false;
          break;
        case "ArrowUp":
          // Up pressed
          this.forward = false;
          break;
        case "ArrowDown":
          // Down pressed
          this.reverse = false;
          break;
      }
      //   console.table(this);
    });
  }
}

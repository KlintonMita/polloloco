/**
 * Represents the game canvas.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * Represents the game world.
 * @type {World}
 */

let world;

/**
 * Represents the keyboard input handler.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Initializes the game by setting up the canvas and creating a new world instance.
 */
function startGame() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

/**
 * Event listener for DOMContentLoaded event, sets up the game when the document is fully loaded.
 */

document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const fullscreenContainer = document.getElementById("fullscreenContainer");
  const gameOverScreen = document.getElementById("gameOverScreen");

  const startButton = document.getElementById("startButton");
  startButton.addEventListener("click", () => {
    startScreen.style.display = "none";
    fullscreenContainer.classList.remove("hidden");
    gameOverScreen.style.display = "none";
    startGame();
    world.run();
    eventsControleTouch();
    eventsControleMouse();
  });

    /**
   * Represents the arrow selector button element.
   * @type {HTMLElement}
   */
  const arrowSelectorButton = document.getElementById("arrowSelector");
  arrowSelectorButton.addEventListener("click", () => {
    showArrows();
  });

    /**
   * Represents the fullscreen button element.
   * @type {HTMLElement}
   */
  const fullscreenButton = document.getElementById("fullscreenButton");
  fullscreenButton.addEventListener("click", () => {
    toggleFullScreen();
  });

    /**
   * Represents the restart button element.
   * @type {HTMLElement}
   */
  const restartButton = document.getElementById("restartButton");
  restartButton.addEventListener("click", () => {
    restartGame();
  });

    /**
   * Restarts the game by clearing intervals and animation frames, then creates a new world instance.
   */
  function restartGame() {
    for (let i = 1; i < 1000; i++) {
      clearInterval(i);
      cancelAnimationFrame(i);
    }
    world.character.clearAllIntervals();
    createWorldInstance();
    gameOverScreen.style.display = "none";

    world.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = worldInstance;
      }
    });
  }

    /**
   * Creates a new world instance and restarts the game.
   */
  function createWorldInstance() {
    let canvas = document.getElementById("canvas");
    worldInstance = new World(canvas, keyboard);
    if (worldInstance) {
      worldInstance.restartGame();
    }
  }

    /**
   * Checks the screen width and adjusts the display of elements accordingly.
   */
  function checkScreenWidth() {
    const rotateScreen = document.getElementById("rotate-screen");
    const startScreen = document.getElementById("start-screen");
    const contentCanvas = document.getElementById("contentCanvas");

    if (window.innerWidth < 900) {
      rotateScreen.classList.remove("hidden");
      startScreen.classList.add("hidden");
      contentCanvas.classList.add("hidden");
    } else {
      rotateScreen.classList.add("hidden");
      startScreen.classList.remove("hidden");
      contentCanvas.classList.remove("hidden");
    }
  }

  checkScreenWidth();

  window.addEventListener("resize", checkScreenWidth);

    /**
   * Toggles the fullscreen mode for the game.
   */
  function toggleFullScreen() {
    const container = document.getElementById("fullscreenContainer");

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.position = "absolute";
      contentCanvas.style.width = "100%";
      contentCanvas.style.height = "100%";
      panel.style.width = "100%";
      panel.style.height = "90%";
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      panel.style.width = "unset";
      panel.style.height = "unset";
      canvas.style.position = "unset";
    }
  }

    /**
   * Shows or hides the arrow selector based on its current display state.
   */
  function showArrows() {
    const arrowSelector = document.getElementById("panel");
    arrowSelector.style.display =
      arrowSelector.style.display === "none" ||
      arrowSelector.style.display === ""
        ? "flex"
        : "none";
  }
});

/**
 * Sets up touch events for controlling game actions.
 */
function eventsControleTouch() {
  document.getElementById("rightArrow").addEventListener("touchstart", () => {
    keyboard.RIGHT = true;
  });

  document.getElementById("rightArrow").addEventListener("touchend", () => {
    keyboard.RIGHT = false;
  });

  document.getElementById("leftArrow").addEventListener("touchstart", () => {
    keyboard.LEFT = true;
  });

  document.getElementById("leftArrow").addEventListener("touchend", () => {
    keyboard.LEFT = false;
  });

  document.getElementById("jumpArrow").addEventListener("touchstart", () => {
    keyboard.SPACE = true;
  });

  document.getElementById("jumpArrow").addEventListener("touchend", () => {
    keyboard.SPACE = false;
  });

  document.getElementById("shoot").addEventListener("touchstart", () => {
    keyboard.D = true;
  });

  document.getElementById("shoot").addEventListener("touchend", () => {
    keyboard.D = false;
  });
}

/**
 * Sets up mouse events for controlling game actions.
 */
function eventsControleMouse() {
  document.getElementById("rightArrow").addEventListener("mousedown", () => {
    keyboard.RIGHT = true;
  });

  document.getElementById("rightArrow").addEventListener("mouseup", () => {
    keyboard.RIGHT = false;
  });

  document.getElementById("leftArrow").addEventListener("mousedown", () => {
    keyboard.LEFT = true;
  });

  document.getElementById("leftArrow").addEventListener("mouseup", () => {
    keyboard.LEFT = false;
  });

  document.getElementById("jumpArrow").addEventListener("mousedown", () => {
    keyboard.SPACE = true;
  });

  document.getElementById("jumpArrow").addEventListener("mouseup", () => {
    keyboard.SPACE = false;
  });
  document.getElementById("shoot").addEventListener("mousedown", () => {
    keyboard.D = true;
  });

  document.getElementById("shoot").addEventListener("mouseup", () => {
    keyboard.D = false;
  });
}

/**
 * Event listener for keydown events, updates keyboard state based on keycodes.
 * @param {KeyboardEvent} e - The keydown event.
 */
window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (e.keyCode == 38) {
    keyboard.UP = true;
  }
  if (e.keyCode == 39) {
    keyboard.DOWN = true;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (e.keyCode == 68) {
    keyboard.D = true;
  }
});

/**
 * Event listener for keyup events, updates keyboard state based on keycodes.
 * @param {KeyboardEvent} e - The keyup event.
 */
window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (e.keyCode == 38) {
    keyboard.UP = false;
  }
  if (e.keyCode == 39) {
    keyboard.DOWN = false;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (e.keyCode == 68) {
    keyboard.D = false;
  }
});

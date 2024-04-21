/**
 * Represents the game world containing various game elements.
 * @class
 * @constructor
 * @param {HTMLCanvasElement} canvas - The canvas element for rendering the game.
 * @param {Keyboard} keyboard - The keyboard input for controlling the game.
 */
class World {
  character = new Character();
  level = level1;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  throwableObject = [];
  statusBarBottle = new StatusBarBottle();
  statusBarCoins = new StatusBarCoins();
  statusBarEndBoss = new StatusBarEndboss();
  collect_sounds = new Audio("./audio/coin.mp3");
  chicken_sounds = new Audio("./audio/normalchicken.mp3");
  bottle_sounds = new Audio("./audio/bottle.mp3");
  gameplay_sounds = new Audio("./audio/gameplay.mp3");

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();

    const muteButton = document.getElementById("muteButton");
    muteButton.addEventListener("click", () => {
      this.toggleMute();
    });
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
      }
    });
  }

  run() {
    this.runInterval = setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkCollisionsBottle();
      this.checkCollisionsCoin();
      this.checkEndBossCollision();

      const endBossAlive = this.level.enemies.some(
        (enemy) => enemy instanceof Endboss && !enemy.isDead
      );

      if (endBossAlive) {
        this.playGameplaySounds();
      } else {
        this.gameplay_sounds.pause();
        this.gameplay_sounds.currentTime = 0;
      }

      if (this.character.isDead()) {
        this.gameplay_sounds.pause();
        this.gameplay_sounds.currentTime = 0;
      }
    }, 100);
  }

  toggleMute() {
    if (this.collect_sounds.muted) {
      this.unmuteSounds();
      muteButton.style.backgroundImage = "url('./ico/sound.png')";
    } else {
      this.muteSounds();
      muteButton.style.backgroundImage = "url('./ico/volume.png')";
    }

    if (this.character.walking_sounds) {
      this.character.walking_sounds.muted = this.collect_sounds.muted;
    }

    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss && enemy.alert_sounds) {
        enemy.alert_sounds.muted = this.collect_sounds.muted;
      }
    });

    if (this.collect_sounds.muted) {
      this.gameplay_sounds.muted = true;
    } else {
      this.gameplay_sounds.muted = false;
      this.playGameplaySounds();
    }
    clearInterval(this.runInterval);

    this.run();
  }

  muteSounds() {
    this.collect_sounds.muted = true;
    this.chicken_sounds.muted = true;
    this.bottle_sounds.muted = true;
    this.gameplay_sounds.muted = true;
  }

  unmuteSounds() {
    this.collect_sounds.muted = false;
    this.chicken_sounds.muted = false;
    this.bottle_sounds.muted = false;
    this.gameplay_sounds.muted = false;
  }

  resetLevel() {
    this.level.bottles = [];
    this.level.coins = [];
    this.level.enemies = [];

    for (let i = 0; i < 5; i++) {
      this.level.bottles.push(new Bottles());
    }
    for (let i = 0; i < 5; i++) {
      this.level.coins.push(new Coins());
    }
    for (let i = 0; i < 5; i++) {
      this.level.enemies.push(new Chicken());
    }
    for (let i = 0; i < 5; i++) {
      this.level.enemies.push(new ChickenSmall());
    }
    for (let i = 0; i < 1; i++) {
      this.level.enemies.push(new Endboss());
    }
  }

  playGameplaySounds() {
    try {
      if (this.gameplay_sounds.paused) {
        this.gameplay_sounds.currentTime = 0;
        this.gameplay_sounds.play();
      }
    } catch (error) {
      console.error('Error playing gameplay sounds:', error);
    }
  }

  restartGame() {
    clearInterval(this.runInterval);
    clearInterval(this.playGameplaySounds());
    this.resetLevel();
    this.gameLost();
    this.run();
  }

  gameLost() {
    let overScreen = document.getElementById("gameOverScreen");
    overScreen.style.display = "flex";
    clearInterval(this.run);
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.statusBarBottle.percentage > 0) {
      let bottleThrow = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      bottleThrow.world = this;
      this.throwableObject.push(bottleThrow);
      this.statusBarBottle.percentage -= 20;
      this.character.bottleBar -= 20;
      this.statusBarBottle.setPercentage(this.statusBarBottle.percentage);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (
        this.character.isColliding(enemy) &&
        !enemy.isDead &&
        !this.character.isHurt()
      ) {
        if (this.character.isAboveGround()) {
          this.jumpOnEnemy();
        } else {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    });
  }

  checkEndBossCollision() {
    this.level.enemies.forEach((enemy) => {
      this.throwableObject.forEach((bottle) => {
        this.bottleCollision(bottle, enemy);
      });
    });
  }

  bottleCollision(bottle, enemy) {
    if (bottle.isColliding(enemy)) {
      if (enemy instanceof Endboss && !enemy.isHurt()) {
        this.handleEndbossCollision(bottle, enemy);
      }
      if (enemy instanceof Chicken) {
        this.chickenCollision(bottle, enemy);
      } else if (enemy instanceof ChickenSmall) {
        this.chickenSmallCollision(bottle, enemy);
      }
      if (!bottle.isSplashing) {
        this.removeBottle(bottle);
      }
    }
  }

  removeBottle(bottle) {
    const bottleIndex = this.throwableObject.indexOf(bottle);
    if (bottleIndex > -1) {
      this.throwableObject.splice(bottleIndex, 1);
    }
  }

  handleEndbossCollision(bottle, endboss) {
    endboss.hitBoss();
    this.statusBarEndBoss.setPercentage(endboss.energy);
    bottle.hitEndboss();
    endboss.playAnimation(endboss.IMAGES_HURT);
    this.removeBottle(bottle);
  }

  chickenCollision(bottle, chicken) {
    chicken.isDead = true;
    this.removeChicken(chicken);
    this.removeBottle(bottle);
    this.chicken_sounds.play();
    setTimeout(() => {
      this.chicken_sounds.pause();
      this.chicken_sounds.currentTime = 0;
    }, 2000);
  }

  chickenSmallCollision(bottle, chickenSmall) {
    chickenSmall.isDead = true;
    this.removeChicken(chickenSmall);
    this.removeBottle(bottle);
    this.chicken_sounds.play();
    setTimeout(() => {
      this.chicken_sounds.pause();
      this.chicken_sounds.currentTime = 0;
    }, 2000);
  }

  removeChicken(enemy) {
    setTimeout(() => {
      const enemyIndex = this.level.enemies.indexOf(enemy);
      if (enemyIndex > -1) {
        this.level.enemies.splice(enemyIndex, 1);
      }
    }, 300);
  }

  checkCollisionsBottle() {
    this.level.bottles.forEach((bottle, i) => {
      if (this.character.isColliding(bottle)) {
        this.character.hitBottle();
        this.statusBarBottle.setPercentage(this.character.bottleBar);
        this.bottle_sounds.play();
        this.level.bottles.splice(i, 1);
      }
    });
  }

  checkCollisionsCoin() {
    this.level.coins.forEach((coin, i) => {
      if (this.character.isColliding(coin)) {
        this.character.hitCoin();
        this.statusBarCoins.setPercentage(this.character.coinBar);
        this.level.coins.splice(i, 1);
        this.collect_sounds.play();
      }
    });
  }

  jumpOnEnemy() {
    this.level.enemies.forEach((enemy) => {
      if (
        this.character.isColliding(enemy) &&
        this.character.isAboveGround() &&
        this.character.isFalling()
      ) {
        if (enemy instanceof Chicken) {
          enemy.isDead = true;
          this.removeChicken(enemy);
          this.chicken_sounds.play();
          setTimeout(() => {
            this.chicken_sounds.pause();
            this.chicken_sounds.currentTime = 0;
          }, 2000);
        } else if (enemy instanceof ChickenSmall) {
          enemy.isDead = true;
          this.removeChicken(enemy);
          this.chicken_sounds.play();
          setTimeout(() => {
            this.chicken_sounds.pause();
            this.chicken_sounds.currentTime = 0;
          }, 2000);
        }
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarEndBoss);
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);

    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.throwableObject);
    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    this.ctx.restore();
    mo.x = mo.x * -1;
  }
}

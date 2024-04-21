/**
 * Represents a movable object in the game.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  bottleBar = 0;
  coinBar = 0;
  lastBottle = 0;

  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Applies gravity to the movable object.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the movable object is above the ground.
   * @returns {boolean} True if the object is above the ground; otherwise, false.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 150;
    }
  }

  /**
   * Checks if the movable object is falling.
   * @returns {boolean} True if the object is falling; otherwise, false.
   */
  isFalling() {
    return this.speedY < 0;
  }

  /**
   * Moves the movable object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Moves the movable object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Checks if the movable object is hurt.
   * @returns {boolean} True if the object is hurt; otherwise, false.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Registers a hit on the movable object, reducing its energy.
   */
  hit() {
    this.energy -= 35;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Registers a hit on the boss, reducing its energy and setting the hurt status.
   * @returns {number} The updated energy level.
   */
  hitBoss() {
    if (this.energy >= 21) {
      this.energy -= 20;
      this.hurt = true;
    } else {
      this.energy = 0;
    }
    return this.energy;
  }

  /**
   * Registers a hit on the movable object with a bottle, increasing the bottle bar.
   */
  hitBottle() {
    this.bottleBar += 20;
    if (this.bottleBar > 100) {
      this.bottleBar = 100;
    } else {
      this.lastBottle = new Date().getTime();
    }
  }

  /**
   * Registers a hit on the movable object with a coin, increasing the coin bar.
   */
  hitCoin() {
    this.coinBar += 20;
    if (this.coinBar > 100) {
      this.coinBar = 100;
    }
  }

  /**
   * Checks if the movable object is dead.
   * @returns {boolean} True if the object is dead; otherwise, false.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Resets the animation of the movable object.
   */
  resetAnimation() {
    this.currentImage = 0;
  }

  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  jump() {
    this.speedY = 30;
  }

  clearAllIntervals() {
    for (let i = 1; i < 9999; i++) {
      window.clearInterval(i);
    }
  }
}

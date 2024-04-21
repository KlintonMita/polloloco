/**
 * Represents a throwable object that extends from MovableObject.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  /**
   * Array of image paths for the bottle rotation animation.
   * @type {string[]}
   */
  IMAGES_BOTTLE_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];
  IMAGES_BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];
  hasHitGround = false;
  isSplashing = false;
  world;

  /**
   * Creates a new ThrowableObject.
   * @param {number} x - The x-coordinate of the object.
   * @param {number} y - The y-coordinate of the object.
   */
  constructor(x, y) {
    super().loadImage(this.IMAGES_BOTTLE_ROTATION[0]);
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 70;
    this.throw();
    this.animateBottles();
  }

  /**
   * Throws the object, applying gravity and animating its movement.
   */
  throw() {
    this.speedY = 30;
    this.applyGravity();
    setInterval(() => {
      if (!this.hasHitGround) {
        this.x += 10;
      }
      if (this.y >= 300 && !this.hasHitGround) {
        this.animateBottleSplash();
        this.hasHitGround = true;
      }
    }, 25);
  }

  /**
   * Animates the rotation of the bottle.
   */
  animateBottles() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
    }, 25);
  }

  /**
   * Animates the bottle splash.
   */
  animateBottleSplash() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
    }, 25);
  }
  /**
   * Signals that the object has hit the end boss, triggering a splash animation.
   */
  hitEndboss() {
    this.isSplashing = true;
    this.animateBottleSplash();
  }
}

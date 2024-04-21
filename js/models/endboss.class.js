/**
 * Represents the end boss character in the game.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;
  energy = 100;
  world;
  isDead = false;
  x = 3800;
  hurt = false;

  alert_sounds = new Audio("./audio/grosse chicken.mp3");

  /**
   * The array of images for the alert animation.
   * @type {string[]}
   */
  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Constructs a new instance of Endboss.
   */
  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.y = 50;
    this.speed = 30;
    this.animationStatus = "idle";
    this.animate();
  }

  /**
   * Calculates the distance to the character.
   * @param {number} distance - The distance value.
   * @returns {number} The distance between the end boss and the character.
   */
  distanceToEndboss(distance) {
    return Math.abs(this.x - this.world.character.x) < distance;
  }

  /**
   * Chases the character when within a certain distance.
   */
  chasingCharacter() {
    if (this.world && this.distanceToEndboss(600)) {
      if (this.i < 10) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.playAnimation(this.IMAGES_ATTACK);
      }
      this.i++;
      if (this.world.character.x < 3800 && !this.firstContact) {
        this.i = 0;
        this.firstContact = true;
      }

      if (this.x - this.world.character.x > 0) {
        this.moveLeft();
        this.otherDirection = false;
      } else {
        this.moveRight();
        this.otherDirection = true;
      }
    }
  }

  /**
   * Ends the game when the end boss is defeated.
   */
  endGame() {
    this.world.gameLost();
  }

  /**
   * Animates the end boss character based on its energy and hurt status.
   */
  animate() {
    this.animationInterval = setInterval(() => {
      if (this.energy === 0) {
        this.isDead = true;
        this.playAnimation(this.IMAGES_DEAD);
        this.alert_sounds.play();

        setTimeout(() => {
          this.endGame();
        }, 3000);
      } else if (this.hurt) {
        this.playAnimation(this.IMAGES_HURT);
        this.alert_sounds.play();
        setTimeout(() => {
          this.hurt = false;
          this.alert = true;
        }, 1000);
      } else if (
        this.world &&
        this.distanceToEndboss(450) &&
        !this.distanceToEndboss(400) &&
        !this.isDead
      ) {
        this.playAnimation(this.IMAGES_ALERT);
      } else if (!this.isDead) {
        this.chasingCharacter();
      }
    }, 300);
  }

  /**
   * Clears all animation intervals.
   */
  clearAllIntervals() {
    clearInterval(this.animationInterval);
  }
}

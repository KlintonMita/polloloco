/**
 * Represents a status bar for a bottle in the game.
 * @extends DrawableObject
 */
class StatusBarBottle extends DrawableObject {
  /**
   * The images representing different percentage levels of the bottle status bar.
   * @type {string[]}
   */
  STATUSBAR_BOTTLE = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];
  percentage = 0;

  constructor() {
    super();
    this.loadImages(this.STATUSBAR_BOTTLE);
    this.x = 40;
    this.y = 50;
    this.height = 60;
    this.width = 200;
    this.setPercentage(0);
  }

  /**
   * Sets the percentage level of the bottle status bar and updates the displayed image.
   * @param {number} percentage - The percentage level (0 to 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.STATUSBAR_BOTTLE[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the image index based on the current percentage level.
   * @returns {number} The index of the image in the STATUSBAR_BOTTLE array.
   */
  resolveImageIndex() {
    if (this.percentage == 0) {
      return 0;
    } else if (this.percentage == 20) {
      return 1;
    } else if (this.percentage == 40) {
      return 2;
    } else if (this.percentage == 60) {
      return 3;
    } else if (this.percentage == 80) {
      return 4;
    } else {
      return 5;
    }
  }
}

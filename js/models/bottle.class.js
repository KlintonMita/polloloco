class Bottles extends MovableObject {
  IMAGES_BOTTLE = [
    "./img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "./img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  constructor() {
    super();
    this.loadImage("./img/6_salsa_bottle/2_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_BOTTLE);
    this.height = 90;
    this.width = 80;
    this.y = 350;
    this.x = 200 + Math.random() * 3000;
    this.animate();
  }

  offset = {
    top: 10,
    left: 25,
    right: 25,
    bottom: 10,
  };
  /**
   * Functions on bootle.class.js
   * @param {string} animate() - this is to animate the bottle
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_BOTTLE);
    }, 200);
  }
}

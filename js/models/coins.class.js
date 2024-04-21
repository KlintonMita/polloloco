/**
 * Represents a coins object in the game.
 * @extends MovableObject
 */
class Coins extends MovableObject {
    /**
     * The images for the coins animation.
     * @type {string[]}
     */
    IMAGES_COINS = ['./img/8_coin/coin_1.png', './img/8_coin/coin_2.png'];

    /**
     * Constructs a new instance of Coins.
     */
    constructor() {
        super();
        this.height = 100;
        this.width = 90;
        this.y = 350;
        this.x = 200 + Math.random() * 3200;
        this.loadImage('./img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COINS);
        this.animate();
    }

    /**
     * Animate the coins by playing the coin animation.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COINS);
        }, 200);
    }
}

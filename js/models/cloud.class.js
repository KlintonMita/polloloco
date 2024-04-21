/**
 * Represents a cloud object in the game.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    /**
     * Constructs a new instance of Cloud.
     */
    constructor() {
        super().loadImage('./img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 3500;

        this.animate();
    }

    /**
     * Animate the movement of the cloud.
     */
    animate() {
        this.moveLeft();
    }
}

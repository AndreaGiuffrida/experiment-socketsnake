export default class Obstacle extends Phaser.Sprite {


	constructor(game, settings = {}) {

		const xPos = Math.round(Math.random() * game.width),
			  	yPos = Math.round(Math.random() * game.height);

		const size = settings.size || game.width / 10

		const graphics = new Phaser.Graphics(game, size, size)
			graphics.beginFill(0x344a53, 1);
			graphics.drawCircle(0, 0, size);
			graphics.endFill();

		super(game, xPos, yPos, graphics.generateTexture())

		this.anchor.set(0.5, 0.5)
		this.width = size
		this.height = size

		this.game.physics.box2d.enable(this)
		this.body.setCircle(size * .5);
		this.body.static = true

		// this.body.angle = Math.round(Math.random() * 360)

		this.game.add.existing(this)

	}
}

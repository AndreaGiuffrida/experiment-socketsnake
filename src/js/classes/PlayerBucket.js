export default class PlayerBucket extends Phaser.Sprite {

	_player = null
	_items = {}
	// _percentPosition = Math.round(Math.random() * 100)
	_percentPosition = Math.round(Math.random() * 100)

	_moveMaxTimeout = 10000

	constructor(player, settings = {}) {
		const color = player.color

		const graphics = new Phaser.Graphics(player.game, 100, 10)
		graphics.beginFill(color, 1);
		graphics.drawRect(0, 0, 100, 10);
		graphics.endFill();

		super(player.game, 0, 0, graphics.generateTexture())

		this.width = 100
		this.height = 10
		this.anchor.set(0.5, 0.5)

		this.game.physics.box2d.enable(this);
		this.body.setCollisionCategory(this.game.collisionGroups.playersBuckets)
		this.body.static = true
		this._player = player

		this.game.add.existing(this)

		// set position
		// this.setPosition()

		this.animate()

		this._perimeter = this.game.width * 2 + this.game.height * 2
		this._percentageWidth = 100 / this._perimeter * this.game.width
		this._percentageHeight = 100 / this._perimeter * this.game.height

		//

	}

	animate() {


		// bound percentage
		if (this._percentPosition > 100) {
			this._percentPosition -= 100
		}

		const move = -25 + Math.round(Math.random() * 50)

		const percentMove = 100 / 25 * Math.abs(move)

		const time = this._moveMaxTimeout / 100 * percentMove

		const percentageDest = Math.abs(this._percentPosition + move)

		var animation = this.game.add.tween(this);
		animation.to({
			_percentPosition : percentageDest
		}, time, Phaser.Easing.Linear.None);
		animation.onComplete.add(this.animate, this);
		animation.start();
	}

	update() {
		this.setPosition()
	}

	setPosition() {

		let percentPosition = this._percentPosition
		if (percentPosition > 100) {
			percentPosition -= 100
		}

		let xPos,
			yPos,
			rotation = 0;
		if (0 <= percentPosition && percentPosition <= this._percentageWidth) {
			xPos = this.game.width / 100 * (100/this._percentageWidth*percentPosition)
			// xPos = Math.round(Math.random() * this.game.width)
			yPos = this.height * .5
			rotation = 0
		} else if (this._percentageWidth < percentPosition && percentPosition <= this._percentageWidth + this._percentageHeight) {
			xPos = this.game.width - this.height * .5
			yPos = this.game.height / 100 * (100/this._percentageHeight*(percentPosition-this._percentageWidth))
			// yPos = Math.round(Math.random() * this.game.height)
			rotation = 90
		} else if (this._percentageWidth + this._percentageHeight < percentPosition && percentPosition <= this._percentageWidth*2 + this._percentageHeight) {
			xPos = this.game.width - (this.game.width / 100 * (100/this._percentageWidth*(percentPosition-this._percentageWidth-this._percentageHeight)))
			// xPos = Math.round(Math.random() * this.game.width)
			yPos = this.game.height - this.height * .5
			rotation = 180
		} else {
			xPos = this.height * .5
			yPos = this.game.height -  (this.game.height / 100 * (100/this._percentageHeight*(this._percentPosition-this._percentageWidth*2-this._percentageHeight)))
			// yPos = Math.round(Math.random() * this.game.height)
			rotation = 270
		}

		this.body.x = xPos
		this.body.y = yPos
		this.body.rotation = Phaser.Math.degToRad(rotation)
	}

	/**
	 * Add an item in the bucket
	 * @param 		{String} 		itemId 		The id of the item to add
	 */
	addItem(itemId) {
		if ( ! this._items[itemId]) {
			this._items[itemId] = 1;
		} else {
			this._items[itemId]++;
		}
	}



}

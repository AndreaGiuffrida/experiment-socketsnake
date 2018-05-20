import __lerp from 'lerp'

import Player from './Player'
import PlayerBucket from './PlayerBucket'

import '../filters/Glow'

export default class Item extends Phaser.Sprite {

	_owner = null
	_item = null
	_fired = false
	id = 'default'

	_colors =

	_settings = {
		color : '#7eec6e',
		size : 20
	}

	constructor(game, settings = {}) {

		const xPos = Math.round(Math.random()*game.width),
			  yPos = Math.round(Math.random()*game.height);

		const colors = [0x7eec6e,0x4d85ec,0xff6c61,0xfdec00,0xe89dff]

		const size = settings.size || 20
		const color = settings.color || colors[Math.round(Math.random() * (colors.length - 1))]

		const graphics = new Phaser.Graphics(game, size, size)
			graphics.beginFill(0xffffff, 1);
			graphics.drawCircle(0, 0, size);
			graphics.endFill();

		super(game, xPos, yPos, graphics.generateTexture());

		this._settings = {
			...this._settings,
			...settings
		}

		this.width = size
		this.height = size
		this.anchor.set(0.5, 0.5);

		this.game.physics.box2d.enable(this)
		this.body.setCircle(size * .5);
		this.body.linearDamping = 2
		// this.body.angularDamping = 2
		this.body.fixedRotation = true
		this.body.restitution = 1
		// this.body.allowRotation = false
		// this.body.static = true

		// collisions
		this.body.setCollisionCategory(this.game.collisionGroups.items)
		this.body.setCategoryPostsolveCallback(this.game.collisionGroups.players, this._onPlayerCollide.bind(this))
		this.body.setCategoryPostsolveCallback(this.game.collisionGroups.playersItems, this._onPlayerItemsCollide.bind(this))
		this.body.setCategoryPostsolveCallback(this.game.collisionGroups.playersBuckets, this._onPlayerBucketsCollide.bind(this))

		// add item to the game
		this.game.add.existing(this)

		// animate in
		this.animIn()

		const trail = new Phaser.Graphics(this.game, 20, 20)
		trail.beginFill(0xffffff, 1);
		trail.drawCircle(0,0,10)
		trail.endFill();
		this._explosionTexture = trail.generateTexture()

		this._explosionEmitter = this.game.add.emitter(this.x, this.y, 0);
		this._explosionEmitter.gravity = 0
		this._explosionEmitter.enableBody = false
		this._explosionEmitter.lifespan = 300
		// this._explosionEmitter.frequency = 1
		// this._explosionEmitter.maxParticleSpeed =
		this._explosionEmitter.minParticleSpeed.setTo(-250,-250)
		this._explosionEmitter.maxParticleSpeed.setTo(250,200)
		this._explosionEmitter.width = 2;
		this._explosionEmitter.minParticleScale = 0
		this._explosionEmitter.maxParticleScale = 1
		this._explosionEmitter.on = false
		this._explosionEmitter.autoScale = true
		this._explosionEmitter.setScale(0,1,0,1,150,Phaser.Easing.Linear.None,true)
		this._explosionEmitter.makeParticles(this._explosionTexture);

	}

	animIn() {
		this.scale.x = 0
		this.scale.y = 0
		var animation = this.game.add.tween(this.scale);
		animation.to({
			x : [2,1],
			y : [2,1]
		}, 1000, Phaser.Easing.Elastic.Out);
		animation.start();
	}

	explode() {

		// console.warn('explode')
		this._explosionEmitter.x = this.x
		this._explosionEmitter.y = this.y
		this._explosionEmitter.start(false, 200, .5, 10)

		// setTimeout(() => {
		// 	this._explosionEmitter.destroy()
		// }, 300)
	}

	_onPlayerCollide(item, player) {
		// add the item to the player
		if ( ! this._owner) {
			player.sprite.addItem(this)
		}
	}

	_onPlayerItemsCollide(item, playerItem) {
		if (item.sprite._fired && playerItem.sprite._owner && ! item.sprite._owner) {
			playerItem.sprite._owner.removeItemsFrom(playerItem.sprite)
		}
	}

	_onPlayerBucketsCollide(item, playerBucket) {
		if ( ! this._owner) {
			playerBucket.sprite.addItem(this.id)
			this.destroy()
		}
	}

	/**
	 * Set the owner
	 * @param 		{Player} 		player 		The player who own the item
	 */
	setOwner(player) {
		this._owner = player;
		if (player) {
			this.body.setCollisionCategory(this.game.collisionGroups.playersItems)
			this.tint = player.color
			this.explode()
		} else {

			this.body.setCollisionCategory(this.game.collisionGroups.obstacles)
			setTimeout(() => {
				if ( ! this.body) return
				this.tint = 0xffffff
				this.body.setCollisionCategory(this.game.collisionGroups.items)
			},200)
		}
	}

	update() {

		// this.body.velocity.x = __lerp(this.body.velocity.x, 0, .03)
		// this.body.velocity.y = __lerp(this.body.velocity.y, 0, .03)

		// if (this.x < 0) {
		// 	this.x = window.innerWidth
		// } else if (this.x > window.innerWidth) {
		// 	this.x = 0;
		// }
		// if (this.y < 0) {
		// 	this.y = window.innerHeight
		// } else if (this.y > window.innerHeight) {
		// 	this.y = 0;
		// }
	}

}

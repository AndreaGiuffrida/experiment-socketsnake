import __lerp from 'lerp'
// import _compact from 'lodash/filter'

import Obstacle from './Obstacle'

/*
    Simple "Shake" plugin
    Created by cocoademon - https://gist.github.com/cocoademon/7276093
*/

/*global Phaser */
/*jslint bitwise: true */

Phaser.Plugin.Shake = function (game, parent) {
    'use strict';
    Phaser.Plugin.call(this, game, parent);

    this.offsetX = 0;
    this.offsetY = 0;

    this.size = 20;
    this.amt = 0.0;

    this.cache = 0;
    // this.objectToShake = this.game.camera.displayObject;
    this.objectToShake = null;
};

Phaser.Plugin.Shake.prototype = Object.create(Phaser.Plugin.prototype);

Phaser.Plugin.Shake.prototype.postUpdate = function () {
    'use strict';

    if ( ! this.objectToShake) return

    this.cache = this.amt * this.size;

    this.offsetX = ((Math.random() * 2 - 1) * this.cache) | 0;
    this.offsetY = ((Math.random() * 2 - 1) * this.cache) | 0;

    this.objectToShake.position.x += this.offsetX;
    this.objectToShake.position.y += this.offsetY;

    this.amt += 0.1
   // this.amt *= 0.95; // Todo: framerate independence!
};

Phaser.Plugin.Shake.prototype.postRender = function () {
    'use strict';
    if ( ! this.objectToShake) return
    this.objectToShake.position.x -= this.offsetX;
    this.objectToShake.position.y -= this.offsetY;
};

Phaser.Plugin.Shake.prototype.shake = function (size, objectToShake) {
    'use strict';
    this.size = size || this.size;
    this.objectToShake = objectToShake || this.objectToShake;

    this.amt = 0;
};


export default class Player extends Phaser.Sprite {

	_cursors = null

	_items = []
	_path = []
	_maxItems = 5
	_spacer = 7
	_spacerFirst = 10
	_firePower = 5

	_moveAngle = Math.round(Math.random() * 360)
	_currentMoveAngle = null
	_speed = 400

	_settings = {
		color : 0xffffff,
		size : 30
	}

	constructor(game, settings = {}) {

		const colors = [0x7eec6e,0x4d85ec,0xff6c61,0xfdec00,0xe89dff]
		const size = settings.size || 30
		const color = settings.color || colors[Math.round(Math.random() * (colors.length - 1))]
		const graphics = new Phaser.Graphics(game, size, size)
			graphics.beginFill(color, 1);
			graphics.moveTo(0,0)
			graphics.lineTo(size, size*.5)
			graphics.lineTo(0, size)
			graphics.lineTo(0,0)
			graphics.endFill();

		const xPos = game.width * .5,
			  yPos = game.height * .5;

		super(game, xPos, yPos, graphics.generateTexture());

		console.log(this.game);

		this._settings = {
			...this._settings,
			...settings,
			color
		}

		this._shake = new Phaser.Plugin.Shake(game);
		this.game.plugins.add(this._shake)

		// init the cursors
		this._cursors = this.game.input.keyboard.createCursorKeys();

		this.anchor.setTo(0.5,0.5);
		this.width = size
		this.height = size

		this.game.physics.box2d.enable(this)

		this.body.setCollisionCategory(this.game.collisionGroups.players)
		this.body.fixedRotation = true

		// add the object to the world
		this.game.add.existing(this);

		for (let i=0; i < this._maxItems * this._spacer + this._spacerFirst; i++) {
			this._path.push({
				position : new Phaser.Point(this.x, this.y),
				rotation : this.rotation
			});
		}

		const trail = new Phaser.Graphics(this.game, size, size)
			trail.beginFill(color, 1);
			trail.drawCircle(0,0,2)
			trail.endFill();


		//  Add an emitter for the ship's trail
		this._trailEmitter = this.game.add.emitter(this.x, this.y, 0);
		this._trailEmitter.gravity = 0
		this._trailEmitter.enableBody = false
		this._trailEmitter.lifespan = 600
		this._trailEmitter.frequency = 0
		this._trailEmitter.maxParticleSpeed = 0
		this._trailEmitter.width = 2;
		this._trailEmitter.minParticleScale = 1
		this._trailEmitter.maxParticleScale = 1
		this._trailEmitter.makeParticles(trail.generateTexture());
		// this._trailEmitter.setXSpeed(0,);
		// this._trailEmitter.setYSpeed(200, 180);
		// this._trailEmitter.setRotation(50,-50);
		// this._trailEmitter.setAlpha(1, 0.01, 800);
		// this._trailEmitter.setScale(0,  0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
		// this._trailEmitter.start(false, 200, 1);
		//

		setTimeout(() => {
			this._allowMovement = true
		}, 1000)

		this.animIn()
	}

	animIn() {

		const trail = new Phaser.Graphics(this.game, 20, 20)
		trail.beginFill(this.color, 1);
		trail.drawRect(0,0,20,20)
		trail.endFill();
		this._explosionTexture = trail.generateTexture()

		this._explosionEmitter = this.game.add.emitter(this.x, this.y, 0);
		this._explosionEmitter.gravity = 0
		this._explosionEmitter.enableBody = false
		this._explosionEmitter.lifespan = 300
		// this._explosionEmitter.frequency = 1
		// this._explosionEmitter.maxParticleSpeed =
		this._explosionEmitter.minParticleSpeed.setTo(-250,-250)
		this._explosionEmitter.maxParticleSpeed.setTo(250,250)
		this._explosionEmitter.width = 2;
		this._explosionEmitter.minParticleScale = 0
		this._explosionEmitter.maxParticleScale = 1
		this._explosionEmitter.on = false
		this._explosionEmitter.autoScale = true
		this._explosionEmitter.setScale(0,1,0,1,150,Phaser.Easing.Linear.None,true)
		this._explosionEmitter.makeParticles(this._explosionTexture);
		this._explosionEmitter.start(false, 200, 1, 100)

		this.scale.x = 0
		this.scale.y = 0
		setTimeout(() => {
			this._explosionEmitter.destroy()

			var animation = this.game.add.tween(this.scale);
			animation.to({
				x : [2,1],
				y : [2,1]
			}, 1000, Phaser.Easing.Elastic.Out);
			animation.start();

		}, 1000)
	}

	animOut() {
		return new Promise((resolve) => {

			this._explosionEmitter.x = this.x
			this._explosionEmitter.y = this.y

			this._destroying = true

			this._shake.shake(10, this);

			if (this._items.length) {
				for (let idx=this._items.length-1; idx>=0; idx--) {
					const item = this._items[idx]
					item.setOwner(null);
					item.body.velocity.x = -500 + Math.round(Math.random()*1000)
					item.body.velocity.y = -500 + Math.round(Math.random()*1000)
					this._items.splice(idx,1);
				}
			}

			setTimeout(() => {
				this._explosionEmitter = this.game.add.emitter(this.x, this.y, 0);
				this._explosionEmitter.gravity = 0
				this._explosionEmitter.enableBody = false
				this._explosionEmitter.lifespan = 300
				this._explosionEmitter.minParticleSpeed.setTo(-400,-400)
				this._explosionEmitter.maxParticleSpeed.setTo(400,400)
				this._explosionEmitter.width = 2;
				this._explosionEmitter.minParticleScale = 0
				this._explosionEmitter.maxParticleScale = 1
				this._explosionEmitter.on = false
				this._explosionEmitter.autoScale = true
				this._explosionEmitter.setScale(0,1,0,1,150,Phaser.Easing.Linear.None,true)
				this._explosionEmitter.makeParticles(this._explosionTexture);
				this._explosionEmitter.start(false, 500, 1, 10)

				this.scale.x = 0
				this.scale.y = 0
				setTimeout(() => {
					this._explosionEmitter.destroy()
					resolve(this)
				}, 1000)
			},500)

		})
	}

	update() {

		if ( ! this._destroying) {
			this._trailEmitter.x = this.x
			this._trailEmitter.y = this.y
			this._trailEmitter.emitParticle()

			// console.log('length', this._path.length);
			for (var i = 1; i <= this._items.length; i++) {
				const item = this._items[i-1];

				const idx = (i === 1) ? this._spacerFirst : this._spacerFirst + this._spacer * (i-1)
				item.body.x = this._path[idx-1].position.x
				item.body.y = this._path[idx-1].position.y
			}

			this._items = this._items.filter((item) => item._owner === this )

		}

		if (this._allowMovement) {

			// remove empty items


			let speed = this._speed - this._items.length * 30
			if (speed < 100) {
				speed = 100
			}

			// make the snake move
			this._currentMoveAngle = this._moveAngle

			this.body.rotation = 2 * Math.PI - Phaser.Math.degToRad(360 - this._currentMoveAngle);

			// apply new velocity to the player
			const newVelocity = this.game.physics.arcade.velocityFromAngle(this._currentMoveAngle, speed);
			this.body.velocity.x = newVelocity.x
			this.body.velocity.y = newVelocity.y

			// move each sections along the path
			if (this._path.length) {
				var part = this._path.pop()
				part.position.setTo(this.x, this.y)
				part.rotation = this.rotation
				this._path.unshift(part)
			}
		}
	}

	moveAngle(angle) {
		this._moveAngle = 360 - angle;
		if (this._currentMoveAngle === null) {
			this._currentMoveAngle = this._moveAngle
		}
	}

	setSpeed(speed) {
		this._speed = speed
	}

	fireItem() {
		// get the item to fire
		const item = this._items.shift();

		if ( ! item) return

		// remove the owner
		item.setOwner(null);

		setTimeout(() => {
			item.body.x += (this.x - item.x) * 3;
			item.body.y += (this.y - item.y) * 3;
			item.body.bullet = true
			setTimeout(() => {
				item._fired = true
				item.body.velocity.x = this.body.velocity.x * this._firePower
				item.body.velocity.y = this.body.velocity.y * this._firePower
				setTimeout(() => {
					item._fired = false
					item.body.bullet = false
				}, 1000)
			}, 20);
		});
	}

	/**
	 * Add a section
	 */
	addItem(item) {

		const itemIdx = this._items.indexOf(item)

		// max items
		if (this._items.length >= this._maxItems) return;
		if (itemIdx !== -1) return

		// set the owner
		item.setOwner(this);

		// animate in
		item.animIn()

		// add the item in the array
		this._items.push(item);
	}

	/**
	 * Remove an item
	 */
	removeItemsFrom(item) {

		const itemIdx = this._items.indexOf(item)

		if (itemIdx === -1) return

		// remove all items from this one
		for (let idx=itemIdx; idx<this._items.length; idx++) {
			const item = this._items[idx]
			item.setOwner(null);
			if (idx > itemIdx) {
				item.body.velocity.x = -500 + Math.round(Math.random()*1000)
				item.body.velocity.y = -500 + Math.round(Math.random()*1000)
			}
			this._items.splice(idx,1);
		}
	}

	get color() {
		return this._settings.color
	}

}


import Obstacle from './Obstacle'
import ItemsManager from './ItemsManager'
import PlayersManager from './PlayersManager'
import RemotePlayersController from './RemotePlayersController'
import '../filters/Vignette'
// import bloomFilter from 'pixi-filters/bin/bloom'

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// generate random positions
function generatePositionsArray(maxX, maxY, safeRadius, irregularity) {
    // declarations
    var positionsArray = [];
    var r, c;
    var rows;
    var columns;
    // count the amount of rows and columns
    rows = Math.floor(maxY / safeRadius);
    columns = Math.floor(maxX / safeRadius);
    // loop through rows
    for (r = 0; r <= rows; r += 1) {
        // loop through columns
        for (c = 0; c <= columns; c += 1) {
            // populate array with point object
            positionsArray.push({
                x: Math.round(maxX * c / columns) + getRandomInt(irregularity * -1, irregularity),
                y: Math.round(maxY * r / rows) + getRandomInt(irregularity * -1, irregularity)
            });
        }
    }
    // return array
    return positionsArray;
}

export default class PlaygroundState extends Phaser.State {

	preload() {
		this.game.load.image('bkg', 'dist/img/bkg-02.jpg');
	}

	create() {

		this.game.stage.backgroundColor = '#2a282a'

		this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bkg');

		// const bloomFilter = new bloomFilter();

		this.itemsManager = new ItemsManager(this)
		this.playersManager = new PlayersManager(this)

		new RemotePlayersController(this);

		// const vignetteFilter = this.game.add.filter('Vignette');
		// vignetteFilter.size = 0.1;
		// vignetteFilter.amount = 0.4;
		// vignetteFilter.alpha = 1.0;
		// this.game.stage.filters = [vignetteFilter]

		// this.game.stage.filters = [bloomFilter]

		// set the physic type
		this.game.physics.startSystem(Phaser.Physics.BOX2D);
		this.game.physics.box2d.setBoundsToWorld();
		this.game.physics.box2d.debugDraw.joints = true;
		this.game.world.enableBody = true;
		this.game.stage.disableVisibilityChange = true;
		this.game.collisionGroups = {
			// items : this.add.physicsGroup(),
			// players : this.add.physicsGroup(),
			// playersItems : this.add.physicsGroup(),
			// playersBuckets : this.add.physicsGroup(),
			// obstacles : this.add.physicsGroup(),
			// deadzone : this.add.physicsGroup()
			items : 0x0002,
			players : 0x0004,
			playersItems : 0x0008,
			playersBuckets : 0x0010,
			obstacles : 0x0012,
			deadzone : 0x0000
		};

		// const bot = new Player(this.game);
		// const botBucket = new PlayerBucket(bot)
		// for(let i=0; i<5; i++) {
		// 	bot.addItem(new Item(this.game));
		// }

		// const positions = generatePositionsArray(this.game.width - 400, this.game.height - 400, 500, 0)
		// positions.forEach((position) => {
		// 	const obstacle = new Obstacle(this.game, 100, 100);
		// 	obstacle.body.x = position.x + 200
		// 	obstacle.body.y = position.y + 200
		// })
	}

	update() {
	}

	render() {
		// this.game.collisionGroups.obstacles.children.forEach((item) => {
		// 	this.game.debug.body(item)
		// });
		// this.game.debug.box2dWorld();
	}

}

import PlaygroundState from './PlaygroundState'

export default class Game extends Phaser.Game {

	constructor(settings = {}) {

		const dpi = window.devicePixelRatio;

		super(settings.canvas.offsetWidth, settings.canvas.offsetHeight, Phaser.WEBGL, settings.canvas)
		this.state.add('Playground', PlaygroundState, false)
		this.state.start('Playground')

		this._fullsize();
	}


	/**
	 * Make the game fullsize
	 */
	_fullsize() {

		// console.log('this', this);
		setTimeout(() => {
			this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
			this.scale.setResizeCallback(() => {
				this.scale.setMaximum();
			});
		}, 1000);
	}

}

import Item from './Item'
export default class ItemsManager {

	_items = []

	_settings = {
		maxPlayersItems : 10,
		maxItems : 15
	}

	constructor(gameState, settings = {}) {
		this._gameState = gameState

		this._settings = {
			...this._settings,
			...settings
		}

		// check every x timeout to see if need to pop a new item
		// depending on the number of player in the game
		setInterval(this._popNewItemIfNeeded.bind(this), 1000)

	}

	_popNewItemIfNeeded() {
		// check items count
		if (this._items.length < this._settings.maxItems && this._items.length < this._gameState.playersManager.playersCount() * this._settings.maxPlayersItems) {
			this.add();
		}
	}

	add() {
		const item = new Item(this._gameState.game)

		console.log('item', item)

		item.events.onDestroy.add((item) => {

			const idx = this._items.indexOf(item)
			if (idx !== -1) this._items.splice(idx,1)

			console.log('item destroyed', item);
		})


		this._items.push(item)
		return item
	}

}

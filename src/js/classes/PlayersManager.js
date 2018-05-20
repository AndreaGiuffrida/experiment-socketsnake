import Player from './Player'
import PlayerBucket from './PlayerBucket'

export default class PlayersManager {

	_players = []

	constructor(gameState) {
		this._gameState = gameState
	}

	add() {
		const player = new Player(this._gameState.game)
		const playerBucket = new PlayerBucket(player)
		player._bucket = playerBucket
		this._players.push(player)
		return player;
	}

	remove(player) {
		const idx = this._players.indexOf(player)
		if (idx === -1) return
		this._players.splice(idx,1)
		// make the player dissapear
		player.animOut().then(() => {
			player._bucket.destroy()
			player.destroy()
		})
	}

	playersCount() {
		return this._players.length
	}

}

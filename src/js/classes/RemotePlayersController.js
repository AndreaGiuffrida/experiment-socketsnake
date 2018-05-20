import remoteStack from 'coffeekraken-remote-stack'

function randomRoomId(length = 3) {
	const chars = 'abcdefghifklmnopqrstuvwxyz'.split('')
	const id = []
	for(let i=0; i<length; i++) {
		id.push(chars[Math.round(Math.random()*(chars.length-1))]);
	}
	return id.join('').toUpperCase()
}

let env = 'DEV';
if (document.location.hostname === 'socketsnake.buzzbrothers.ch') {
	env = 'PROD';
}

export default class RemotePlayersController {

	_players = {}

	constructor(gameState) {

		const myApp = new remoteStack.App({}, {
			host : (env === 'PROD') ? 'bbtechlab01.buzzbrothers.ch' : document.location.hostname
		});

		const roomId = randomRoomId();

		const instructionsElm = document.querySelector('[desktop-instructions]');
		if (instructionsElm) {
			instructionsElm.innerHTML = instructionsElm.innerHTML.replace('{URL}', document.location.href).replace('{ROOMID}', roomId);
		}

		myApp.announce(roomId).then(() => {
			console.log('game joined');
			// the app has been annouced in the "cool-room"
		});
		// listen for some events
		myApp.on('client.joined', (client) => {
			// add a player
			this._players[client.id] = gameState.playersManager.add();
		})
		myApp.on('client.left', (client) => {
			// handle the left client...
			 gameState.playersManager.remove(this._players[client.id]);
		})
		myApp.on('client.data', (client, data) => {
			// client has sent the data...
			// console.log('client data', data, client);

			// console.log('players', this._players, client);

			// console.log('data', data);

			switch(data.type) {
				case 'move':
					this._players[client.id].moveAngle(data.angle);
				break;
				case 'accelerate':
					if (data.value) {
						this._players[client.id].setSpeed(500);
					} else {
						this._players[client.id].setSpeed(400);
					}
				break;
				case 'fire':
					this._players[client.id].fireItem();
				break;
			}




		})

	}

}

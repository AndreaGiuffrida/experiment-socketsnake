import remoteStack from 'coffeekraken-remote-stack'
import nipplejs from 'nipplejs';

// force http cause of socketio
// if (location.protocol != 'http:') {
// 	location.href = 'http:' + window.location.href.substring(window.location.protocol.length);
// }

const myClient = new remoteStack.Client({
	username : 'John'
});

myClient.announce().then(() => {
	return myClient.join('game');
}).then((room) => {
	// the client has joiend the room.
	// use now the passed "room" instance to send data to app, etc...
	console.log('Joined Game');

	const accelerateElm = document.querySelector('.gamepad__accelerate');
	const fireElm = document.querySelector('.gamepad__fire');

	if (accelerateElm) {
		accelerateElm.addEventListener('touchstart', _onAccelerateStart.bind(this))
		accelerateElm.addEventListener('mousedown', _onAccelerateStart.bind(this))
		accelerateElm.addEventListener('touchend', _onAccelerateEnd.bind(this))
		accelerateElm.addEventListener('mouseup', _onAccelerateEnd.bind(this))
	}
	if (fireElm) {
		// fireElm.addEventListener('touchend', _onFire.bind(this))
		fireElm.addEventListener('touchend', _onFire.bind(this))
		fireElm.addEventListener('mouseup', _onFire.bind(this))
	}

	function _onAccelerateStart(e) {
		room.sendToApp({
			type : 'accelerate',
			value : true
		});
	}
	function _onAccelerateEnd(e) {
		room.sendToApp({
			type : 'accelerate',
			value : false
		});
	}

	function _onFire(e) {
		room.sendToApp({
			type : 'fire'
		});
	}

	setTimeout(() => {
		const joystickElm = document.querySelector(`.gamepad__joystick`);
		joystickManager = nipplejs.create({
			zone: joystickElm,
			fadeTime:0,
			color: 'blue'
		});

		let start = {
			x : 0,
			y : 0
		};

		let sendPositionInterval = null;
		let joystick = null
		let angle = 0

		joystickManager.on('move', (e, data) => {
			const percent = 100 / (e.target.defaults.size/2) * data.distance

			room.sendToApp({
				type : 'move',
				angle : data.angle.degree
			});

		});


	}, 100);


});

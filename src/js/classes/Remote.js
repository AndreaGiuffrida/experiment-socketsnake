import __remoteStack from 'coffeekraken-remote-stack'
import __Vue from 'vue/dist/vue';
import nipplejs from 'nipplejs';

let client, joystickManager;

let env = 'DEV';
if (document.location.hostname === 'socketsnake.buzzbrothers.ch') {
	env = 'PROD';
}

__Vue.component('thiefrun-remote', {
	template: '<span>{{ message }}</span>',
	data: () => {
		return {
			missedTurn : false,
			room : null,
			client : null,
			roomId : null,
		}
	},
	template : `
		<div class="gamepad">
			<div v-if="! room">
				<form class="gamepad__form t-center" name="join" v-on:submit="join">
					<h1 class="h1 m-b">
						Hello!
					</h1>
					<p class="p m-b">
						Enter the room id displayed on your desktop screen.
					</p>
					<input class="form-input m-b-small s-medium" type="text" name="roomId" placeholder="JDE" v-model="roomId" />
					<input class="btn btn--block s-medium" type="submit" value="Join!" />
				</form>
			</div>
			<div v-if="room">
				<div class="gamepad__joystick">
					<div class="gamepad__label">Direction</div>
				</div>
				<div class="gamepad__fire">
					<div class="gamepad__label">Fire!</div>
				</div>
				<div class="gamepad__accelerate">
					<div class="gamepad__label">Accelerate</div>
				</div>
			</div>
		</div>
	`,
	methods : {

		join : function(e = null) {

			if (e) e.preventDefault();

			client = new __remoteStack.Client({}, {
				compression : false,
				host : (env === 'PROD') ? 'bbtechlab01.buzzbrothers.ch' : document.location.hostname,
				debug : true
			});
			client.on('missed-turn', (room) => {
				this.missedTurn = true;
				setTimeout(() => {
					this.missedTurn = false;
				}, 3000);
			});
			client.announce().then(() => {
				console.log('client has been announced', client);
				this.client = client

				client.join(this.roomId).then((room) => {

					this.room = room;

					room.on('closed', (room) => {
						this.room = null
						this.roomId = null
					})

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

						const joystickElm = document.querySelector(`.gamepad__joystick`);
						joystickManager = nipplejs.create({
							zone: joystickElm,
							fadeTime:0,
							color: 'white'
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

				}, (error) => {
					console.error(error);
				});

			});

		},
		leave : function(room) {

			if (joystickManager) {
				joystickManager.destroy();
			}

			room.leave().then((room) => {
				console.log('leaved the room', room.id);
			});

		}
	}
});

export default class Remote {

	joystickManager = null;
	client = null;

	constructor(settings = {}) {
		settings.container.innerHTML = `
			<thiefrun-remote></thiefrun-remote>
		`;
		var app = new __Vue({
			el: settings.container
		});
	}

}




module.exports = {
	port : 3030,
	defaultNewRoomSettings : {
		maxClients : 10,
		pickedTimeout : 10000,
		averageSessionDuration : 20000,
		sessionDuration : -1
	},
	allowNewRooms : true,
	newRoomIdPattern : /[a-zA-Z]{3}/,
	// sslCertificate : {
	// 	key : __dirname + '/.ssl/socketsnake-buzzbrothers-ch.key',
	// 	cert : __dirname + '/.ssl/socketsnake-buzzbrothers-ch.crt',
	// 	passphrase : 'm7oTsygqj:.R'
	// }
}

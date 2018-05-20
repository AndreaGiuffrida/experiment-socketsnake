const path = require('path');
module.exports = {
	entry: {
		'dist/js/phaser.js' : './src/js/phaser.js',
		'dist/js/app.js' : './src/js/app.js',
		'dist/js/remote.js' : './src/js/remote.js'
	},
	output: {
		path: path.resolve(__dirname),
		filename: '[name]',
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(bower_components|node_modules)/,
			use: 'babel-loader'
		}]
	},
	node: {
		fs: "empty"
	}
}

module.exports = {
	// server port
	port : 3333,

	// title
	title : '{project-name}',

	// logo
	logo : null,

	// documentation settings
	documentation : {

		// files (glob patterns)
		files : [
			'README.md',
			'node_modules/coffeekraken-sugar/**/*.md',
			'node_modules/coffeekraken-gridle/**/*.md',
			'node_modules/coffeekraken-s-*/**/*.md',
		]
	},

	// styleguide file
	styleguide : {

		// source styleguide files
		files : [
			'dist/css/style.css',
			'dist/js/app.js'
		],

		// additionnal displays files to load
		displays : [
			'node_modules/coffeekraken-gridle/carpenter.displays.js'
		]
	}
}

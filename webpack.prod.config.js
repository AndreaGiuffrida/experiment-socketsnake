const webpackConfig = require('./webpack.config');
const _merge = require('lodash/merge');
const _webpack = require('webpack');

// reset entries
delete webpackConfig.entry;

module.exports = _merge(webpackConfig, {
	entry : {
		'dist/js/app.min.js' : './src/js/app.js'
	},
	plugins : [
		new _webpack.optimize.UglifyJsPlugin()
	]
});

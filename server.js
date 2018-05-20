const express = require('express');

const app = express();

app.use(function(req, res, next) {
	res.setHeader("Strict-Transport-Security", "max-age=0;");
	return next();
});

app.use('/dist', express.static(require('path').join(__dirname, 'dist')))

app.get('/box2d-plugin-full.min.js', function(req, res) {
	res.sendFile(__dirname + '/box2d-plugin-full.min.js');
});
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.listen(3080, function () {
	console.log('Socketsnake app listening on port 3080!')
});

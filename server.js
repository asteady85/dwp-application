const express = require('express');

// define our app using express
const app = express();
const port = process.env.port || 8080;
app.set('port', port);

// express routing
app.all('/*', (req, res, next) => {
	if (req.method === 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});
app.use('/users', require('./src/users'));

// Fallback
app.get('*', (req, res) => {
	res.status(404).send('error, page not found');
});

// on load
const server = app.listen(port, () => {
	console.log('Listening at port %s', server.address().port);
});
module.exports = server;

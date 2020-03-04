const app = require('express')();
const functions = require('./utils/functions');
// const { uniqueUserList, usersInCity, usersNearCity } = require('./utils/functions');

/**
 * No output for root
 */
app.get('/', (req, res) => {
	res.send('');
});

/**
 * Function will return the list of users
 * @param {string} city name of the city to get users
 * @return {array} array of user objects
 */
app.get('/liveincity/:city', async (req, res) => {
	try {
		const result = await functions.usersInCity(req.params.city);
		res.send(result);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

/**
 * Function will return the list of users within a specified number of miles of the chosen location
 * @param {string} city name of the city
 * @param {number} miles distance in miles away from the specified city
 * @return {array} array of user objects
 */
app.get('/incityradius/:city/:miles', async (req, res) => {
	try {
		const result = await functions.usersNearCity(req.params.city, req.params.miles);
		res.send(result);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

/**
 * Return a list of users that are from the city and who are currently in the
 * city with a radius of miles
 * @param {string} city name of the city
 * @param {number} miles distance in miles away from the specified city
 * @return {array} array of user objects
 */
app.get('/getallincityradius/:city/:miles', async (req, res) => {
	try {
		// get user data
		const resultLive = await functions.usersInCity(req.params.city);
		const resultNear = await functions.usersNearCity(req.params.city, req.params.miles);
		// sort user list
		const users = functions.uniqueUserList(resultLive.concat(resultNear));
		res.send(users);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

module.exports = app;

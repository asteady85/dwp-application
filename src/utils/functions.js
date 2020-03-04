const axios = require('axios');
const { cityLocations } = require('./positions');
const { distanceBetweenPositionsMiles } = require('./distance');

const domain = 'https://bpdts-test-app.herokuapp.com/';

/**
 * convert user object from api to name, email and position
 * @param {object} obj user object
 * @return {object}
 */
const convertBpdtsUserObj = (obj) => ({
	name: `${obj.first_name} ${obj.last_name}`,
	email: obj.email,
	latitude: obj.latitude,
	longitude: obj.longitude,
});

/**
 * convert array of users to new object
 * @param {array} data
 * @return {array}
 */
const convertBpdtsUserData = (data) => (data.map((user) => convertBpdtsUserObj(user)));

/**
 * Takes array of users and removes any duplicate entries
 * @param {array} users
 * @return {array} filtered array
 */
const uniqueUserList = (users) => (
	users.filter((v, i, a) => a.findIndex((t) => (t.email === v.email)) === i)
);

/**
 * Takes a user list as an array and checks each position is within the chosen distance
 * @param {string} city
 * @param {number} distanceMiles
 * @return {array} array of users
 */
const usersNearCity = (city, distanceMiles) => axios.get(`${domain}users`)
	.then((response) => {
		const users = response.data;
		const usersInRadius = [];
		users.forEach((user) => {
			const londonLatLng = cityLocations[city];
			if (typeof londonLatLng === 'object') {
				const userLatLng = { latitude: user.latitude, longitude: user.longitude };
				const miles = distanceBetweenPositionsMiles(userLatLng, londonLatLng);
				if (miles <= distanceMiles) usersInRadius.push(convertBpdtsUserObj(user));
			} else {
				throw new Error('City location not found');
			}
		});
		return usersInRadius;
	})
	.catch((error) => {
		throw new Error(error);
	});

/**
 * Get a list of users who are registered living in the selected city
 * @param {string} city
 * @return {array} array of user objects
 */
const usersInCity = (city) => axios.get(`${domain}city/${city}/users`)
	.then((response) => convertBpdtsUserData(response.data))
	.catch((error) => {
		throw new Error(error);
	});

module.exports = Object.create({
	convertBpdtsUserObj, convertBpdtsUserData, uniqueUserList, usersInCity, usersNearCity,
});

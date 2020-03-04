const axios = require('axios');
const { cityLocations } = require('./positions');
const { distanceBetweenPositionsMiles } = require('./distance');

const domain = 'https://bpdts-test-app.herokuapp.com/';

const convertBpdtsUserObj = (obj) => ({
	name: `${obj.first_name} ${obj.last_name}`,
	email: obj.email,
	latitude: obj.latitude,
	longitude: obj.longitude,
});

const convertBpdtsUserData = (data) => (data.map((user) => convertBpdtsUserObj(user)));

const uniqueUserList = (users) => (
	users.filter((v, i, a) => a.findIndex((t) => (t.email === v.email)) === i)
);

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

const usersInCity = (city) => axios.get(`${domain}city/${city}/users`)
	.then((response) => convertBpdtsUserData(response.data))
	.catch((error) => {
		console.log(`Error on domain: ${domain}city/${city}/users`);
		throw new Error(error);
	});

module.exports = Object.create({
	convertBpdtsUserObj, convertBpdtsUserData, uniqueUserList, usersInCity, usersNearCity,
});

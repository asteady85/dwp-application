const haversine = require('haversine-distance');

// using the haversine formula to return distance from 2 co-ords in meters
const haversineFormula = (latLng1, latLng2) => haversine(latLng1, latLng2);

// return the number of meters to miles
const convertMetersToMiles = (meters) => meters * 0.000621371;

// calculating the distance in miles between 2 co-ords
const distanceBetweenPositionsMiles = (latLng1, latLng2) => {
	const meters = haversineFormula(latLng1, latLng2);
	return convertMetersToMiles(meters);
};

module.exports = Object.create({ convertMetersToMiles, distanceBetweenPositionsMiles });

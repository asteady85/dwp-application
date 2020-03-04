const {
	convertMetersToMiles, distanceBetweenPositionsMiles,
} = require('../../utils/distance');

describe('convertMetersToMiles', () => {
	it('will convert a number of meters into miles', () => {
		expect(convertMetersToMiles(10000)).toEqual(6.21371);
	});
});

describe('distanceBetweenPositionsMiles', () => {
	it('will use the haversine formula to calculate distance between 2 coords', () => {
		const pos1 = { latitude: 1, longitude: 1 };
		const pos2 = { latitude: 2, longitude: 2 };
		expect(distanceBetweenPositionsMiles(pos1, pos2)).toEqual(97.80476538861188);
	});
});

const request = require('supertest');
const server = require('../../../server');
const functions = require('../../utils/functions');

const usersLiveInCity = [{
	name: 'Mechelle Boam', email: 'mboam3q@thetimes.co.uk', latitude: -6.5115909, longitude: 105.652983,
}, {
	name: 'Terry Stowgill', email: 'tstowgillaz@webeden.co.uk', latitude: -6.7098551, longitude: 111.3479498,
}];

const usersInCityRadius = [{
	name: 'Ancell Garnsworthy', email: 'agarnsworthy7d@seattletimes.com', latitude: 51.6553959, longitude: 0.0572553,
}, {
	name: 'Terry Stowgill', email: 'tstowgillaz@webeden.co.uk', latitude: -6.7098551, longitude: 111.3479498,
}];

describe('Users', () => {
	afterAll(() => {
		server.close();
	});
	describe('Initialisation', () => {
		it('should load the root directory', (done) => {
			request(server)
				.get('/users')
				.expect(200, done);
		});
		it('404 uknown url', (done) => {
			request(server)
				.get('/foo/bar')
				.expect(404, done);
		});
	});

	describe('GIVEN to get a list of users from a city', () => {
		it('should return a list of users from London', async (done) => {
			functions.usersInCity = jest.fn(() => Promise.resolve(usersLiveInCity));

			const response = await request(server).get('/users/liveincity/London');
			expect(response.status).toEqual(200);
			expect(response.body).toEqual(usersLiveInCity);
			done();
		});
		it('will throw a 400 error if usersInCity function throws an error', async (done) => {
			functions.usersInCity = jest.fn(() => Promise.reject(new Error('Some Error Occurred')));

			const response = await request(server).get('/users/liveincity/London');
			expect(response.status).toEqual(400);
			expect(response.text).toEqual('Some Error Occurred');
			done();
		});
	});

	describe('GIVEN to get a list of users within a raduis of a city', () => {
		it('should return a list of users in 50 miles of London', async (done) => {
			functions.usersNearCity = jest.fn(() => Promise.resolve(usersInCityRadius));

			const response = await request(server).get('/users/incityradius/London/50');
			expect(response.status).toEqual(200);
			expect(response.body).toEqual(usersInCityRadius);
			done();
		});
		it('will throw a 400 error if usersNearCity function throws an error', async (done) => {
			functions.usersNearCity = jest.fn(() => Promise.reject(new Error('Some Error Occurred')));

			const response = await request(server).get('/users/incityradius/London/50');
			expect(response.status).toEqual(400);
			expect(response.text).toEqual('Some Error Occurred');
			done();
		});
	});

	describe('GIVEN to get a list of users within a raduis of a city', () => {
		it('should return a list of users in 50 miles of London', async (done) => {
			functions.usersInCity = jest.fn(() => Promise.resolve(usersLiveInCity));
			functions.usersNearCity = jest.fn(() => Promise.resolve(usersInCityRadius));
			const combinedUsersList = [{
				name: 'Mechelle Boam', email: 'mboam3q@thetimes.co.uk', latitude: -6.5115909, longitude: 105.652983,
			}, {
				name: 'Terry Stowgill', email: 'tstowgillaz@webeden.co.uk', latitude: -6.7098551, longitude: 111.3479498,
			}, {
				name: 'Ancell Garnsworthy', email: 'agarnsworthy7d@seattletimes.com', latitude: 51.6553959, longitude: 0.0572553,
			}];

			const response = await request(server).get('/users/getallincityradius/London/50');
			expect(response.status).toEqual(200);
			expect(response.body).toEqual(combinedUsersList);
			done();
		});
		it('will throw a 400 error if usersInCity or usersNearCity function throws an error', async (done) => {
			functions.usersInCity = jest.fn(() => Promise.reject(new Error('Some Error Occurred')));
			functions.usersNearCity = jest.fn(() => Promise.reject(new Error('Some Error Occurred')));

			const response = await request(server).get('/users/getallincityradius/London/50');
			expect(response.status).toEqual(400);
			expect(response.text).toEqual('Some Error Occurred');
			done();
		});
	});
});

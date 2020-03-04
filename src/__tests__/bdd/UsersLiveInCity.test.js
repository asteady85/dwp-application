const axios = require('axios');
const request = require('supertest');
const server = require('../../../server');

let userList = [];

describe('GIVEN I want a list of users who live in a city', () => {
	beforeAll(async (done) => {
		await axios.get('https://bpdts-test-app.herokuapp.com/city/London/users')
			.then((response) => {
				userList = response.data;
				done();
			});
	});
	afterAll(() => {
		server.close();
	});

	describe('WHEN I search for `London`', () => {
		it('should return a list of users from `London`', async (done) => {
			const response = await request(server).get('/users/liveincity/London');
			const returnList = response.body;

			expect(response.status).toEqual(200);
			expect(returnList.length).toBeGreaterThan(0);
			done();
		});
		it('first name in array should match first in return list', async (done) => {
			const response = await request(server).get('/users/liveincity/London');
			const returnList = response.body;
			const ourName = returnList[0].name;
			const apiName = `${userList[0].first_name} ${userList[0].last_name}`;

			expect(apiName).toEqual(ourName);
			done();
		});
	});
});

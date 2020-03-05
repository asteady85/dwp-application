const axios = require('axios');
const request = require('supertest');
const server = require('../../../server');

let userList = [];

describe('GIVEN I want a list of users who are currently in radius of a city', () => {
	jest.setTimeout(20000); // wait for heroku to boot first time

	beforeAll(async (done) => {
		await axios.get('https://bpdts-test-app.herokuapp.com/users')
			.then((response) => {
				userList = response.data;
				done();
			});
	});
	afterAll(() => {
		server.close();
	});

	describe('WHEN I search for a user list in `London` and in a `50` mile radius', () => {
		it('should return a list of users as an array', async (done) => {
			const response = await request(server).get('/users/incityradius/London/50');
			const returnList = response.body;

			expect(response.status).toEqual(200);
			expect(returnList.length).toBeGreaterThan(0);
			done();
		});
		it('first name in array should match first in return list', async (done) => {
			const response = await request(server).get('/users/incityradius/London/50');
			const returnList = response.body;
			const ourName = returnList[0].name;
			const resultInUserList = userList.find((u) => u.email === returnList[0].email);
			const apiName = `${resultInUserList.first_name} ${resultInUserList.last_name}`;

			expect(apiName).toEqual(ourName);
			done();
		});
	});
});

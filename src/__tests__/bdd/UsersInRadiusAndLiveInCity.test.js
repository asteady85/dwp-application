const axios = require('axios');
const request = require('supertest');
const server = require('../../../server');

let userList = [];

describe('GIVEN I want a list of users who either live in a city or currently in radius of', () => {
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

	describe('WHEN I search for `London` and a `50` mile radius', () => {
		it('should return a list of users from the api', async (done) => {
			const response = await request(server).get('/users/getallincityradius/London/50');
			const returnList = response.body;

			expect(response.status).toEqual(200);
			expect(returnList.length).toBeGreaterThan(0);
			done();
		});
		it('first name in array should match first in return list', async (done) => {
			const response = await request(server).get('/users/getallincityradius/London/50');
			const returnList = response.body;
			const ourName = returnList[0].name;
			const resultInUserList = userList.find((u) => u.email === returnList[0].email);
			const apiName = `${resultInUserList.first_name} ${resultInUserList.last_name}`;

			expect(apiName).toEqual(ourName);
			done();
		});
	});
});

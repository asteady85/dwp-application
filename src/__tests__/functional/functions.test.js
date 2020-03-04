const axios = require('axios');
const {
	convertBpdtsUserObj, convertBpdtsUserData, uniqueUserList, usersInCity, usersNearCity,
} = require('../../utils/functions');

jest.mock('axios');

const userList1 = [{
	id: 135, first_name: 'Mechelle', last_name: 'Boam', email: 'mboam3q@thetimes.co.uk', ip_address: '113.71.242.187', latitude: -6.5115909, longitude: 105.652983,
}, {
	id: 396, first_name: 'Terry', last_name: 'Stowgill', email: 'tstowgillaz@webeden.co.uk', ip_address: '143.190.50.240', latitude: -6.7098551, longitude: 111.3479498,
}, {
	id: 520, first_name: 'Andrew', last_name: 'Seabrocke', email: 'aseabrockeef@indiegogo.com', ip_address: '28.146.197.176', latitude: 27.69417, longitude: 109.73583,
}];
const userList1Converted = [
	{
		name: 'Mechelle Boam', email: 'mboam3q@thetimes.co.uk', latitude: -6.5115909, longitude: 105.652983,
	}, {
		name: 'Terry Stowgill', email: 'tstowgillaz@webeden.co.uk', latitude: -6.7098551, longitude: 111.3479498,
	}, {
		name: 'Andrew Seabrocke', email: 'aseabrockeef@indiegogo.com', latitude: 27.69417, longitude: 109.73583,
	},
];
const userList2 = [{
	id: 135, first_name: 'Mechelle', last_name: 'Boam', email: 'mboam3q@thetimes.co.uk', ip_address: '113.71.242.187', latitude: -6.5115909, longitude: 105.652983,
}, {
	id: 396, first_name: 'Terry', last_name: 'Stowgill', email: 'tstowgillaz@webeden.co.uk', ip_address: '143.190.50.240', latitude: -6.7098551, longitude: 111.3479498,
}, {
	id: 266, first_name: 'Ancell', last_name: 'Garnsworthy', email: 'agarnsworthy7d@seattletimes.com', ip_address: '67.4.69.137', latitude: 51.6553959, longitude: 0.0572553,
}];

describe('convertBpdtsUserObj', () => {
	it('GIVEN a user object, it should return a formatted object', () => {
		const obj = {
			id: 135, first_name: 'Mechelle', last_name: 'Boam', email: 'mboam3q@thetimes.co.uk', ip_address: '113.71.242.187', latitude: -6.5115909, longitude: 105.652983, city: 'London',
		};
		const returnObj = {
			name: 'Mechelle Boam', email: 'mboam3q@thetimes.co.uk', latitude: -6.5115909, longitude: 105.652983,
		};
		expect(convertBpdtsUserObj(obj)).toEqual(returnObj);
	});
});

describe('convertBpdtsUserData', () => {
	it('GIVEN an array of user objects, it should return the array in a formatted object', () => {
		expect(convertBpdtsUserData(userList1)).toEqual(userList1Converted);
	});
});

describe('uniqueUserList', () => {
	it('it will remove the duplicates and leave 2 users in the array', () => {
		const duplicateList = [
			{
				name: 'Name 1', email: 'name1@gmail.com', latitude: 1, longitude: 1,
			},
			{
				name: 'Name 2', email: 'name2@gmail.com', latitude: 2, longitude: 2,
			},
			{
				name: 'Name 1', email: 'name1@gmail.com', latitude: 1, longitude: 1,
			},
		];
		const returnList = [
			{
				name: 'Name 1', email: 'name1@gmail.com', latitude: 1, longitude: 1,
			},
			{
				name: 'Name 2', email: 'name2@gmail.com', latitude: 2, longitude: 2,
			},
		];
		const newList = uniqueUserList(duplicateList);
		expect(newList.length).toEqual(2);
		expect(newList).toEqual(returnList);
	});
});

describe('usersInCity', () => {
	it('it will return a list of users whose location is based in `London`', () => {
		axios.get.mockResolvedValueOnce({ data: userList1 });
		return usersInCity('London').then((data) => expect(data).toEqual(userList1Converted));
	});
	it('should throw an error in the catch', async () => {
		jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('error'));
		await expect(usersInCity('London')).rejects.toThrow('error');
	});
});

describe('usersNearCity', () => {
	it('will return 1 user within 50 miles of `London`', () => {
		const output = [{
			name: 'Ancell Garnsworthy', email: 'agarnsworthy7d@seattletimes.com', latitude: 51.6553959, longitude: 0.0572553,
		}];
		axios.get.mockResolvedValueOnce({ data: userList2 });
		return usersNearCity('London', 50).then((data) => expect(data).toEqual(output));
	});
	it('will return 0 users within 50 miles of `London`', () => {
		const users = [{
			id: 135, first_name: 'Mechelle', last_name: 'Boam', email: 'mboam3q@thetimes.co.uk', ip_address: '113.71.242.187', latitude: -6.5115909, longitude: 105.652983,
		}];
		axios.get.mockResolvedValueOnce({ data: users });
		return usersNearCity('London', 50).then((data) => {
			expect(data).toEqual([]);
			expect(data.length).toEqual(0);
		});
	});
	it('will throw if city not in list', async () => {
		axios.get.mockResolvedValueOnce({ data: userList2 });
		await expect(usersNearCity('Some Unlisted City')).rejects.toThrow('Error: City location not found');
	});
});

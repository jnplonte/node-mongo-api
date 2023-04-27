export default function userSeed() {
	return {
		name: 'users',
		seed: [
			{
				_id: '644aa3d0595af809a6dfbf75',
				firstName: 'super',
				lastName: 'admin',
				phone: '639111111111',
				email: '',
				password: '409b79d8bbb3c92aa66198d81af8e4bf5e7338767e8b9904438d68088a265d9b',
				salt: 'testsalt',

				roleId: 'ADMIN',
				languageId: 'ENGLISH',
				countryId: 'PHILIPPINES',
				cityId: 'NONE',
				postalName: '',
				postalId: 0,

				active: true,
				verified: true,
			},
			{
				_id: '644aa3dc9217656db89ffc4b',
				firstName: 'customer 1',
				lastName: 'admin',
				phone: '639222222222',
				email: '',
				password: '409b79d8bbb3c92aa66198d81af8e4bf5e7338767e8b9904438d68088a265d9b',
				salt: 'testsalt',

				roleId: 'CUSTOMERADMIN',
				languageId: 'ENGLISH',
				countryId: 'PHILIPPINES',
				cityId: 'QUEZONCITY',
				postalName: 'baesa',
				postalId: 1106,

				active: true,
				verified: true,
			},
			{
				_id: '644aa403bd52c135bc826cb6',
				firstName: 'customer 2',
				lastName: 'admin',
				phone: '639333333333',
				email: '',
				password: '409b79d8bbb3c92aa66198d81af8e4bf5e7338767e8b9904438d68088a265d9b',
				salt: 'testsalt',

				roleId: 'CUSTOMERADMIN',
				languageId: 'ENGLISH',
				countryId: 'PHILIPPINES',
				cityId: 'QUEZONCITY',
				postalName: 'talipapa',
				postalId: 1116,

				active: true,
				verified: true,
			},
			{
				_id: '644aa3fdf6cf39da60a5ec0e',
				firstName: 'customer 2',
				lastName: 'user',
				phone: '639444444444',
				email: '',
				password: '409b79d8bbb3c92aa66198d81af8e4bf5e7338767e8b9904438d68088a265d9b',
				salt: 'testsalt',

				roleId: 'CUSTOMERUSER',
				languageId: 'ENGLISH',
				countryId: 'PHILIPPINES',
				cityId: 'QUEZONCITY',
				postalName: 'talipapa',
				postalId: 1116,

				active: true,
				verified: true,
			},
			{
				_id: '644aa3f8feb55555c3e8208b',
				firstName: 'user',
				lastName: 'user',
				phone: '639555555555',
				email: '',
				password: '409b79d8bbb3c92aa66198d81af8e4bf5e7338767e8b9904438d68088a265d9b',
				salt: 'testsalt',

				roleId: 'USER',
				languageId: 'ENGLISH',
				countryId: 'PHILIPPINES',
				cityId: 'QUEZONCITY',
				postalName: 'talipapa',
				postalId: 1116,

				active: true,
				verified: true,
			},
		],
	};
}

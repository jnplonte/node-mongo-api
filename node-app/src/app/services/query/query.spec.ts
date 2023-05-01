import { expect } from 'chai';
import { Query } from './query.service';
import { baseConfig } from './../../../config';

import { setup } from './../../../models';

describe('query service', () => {
	let services;
	let models;

	const getfinalData = function (data) {
		data = typeof data.get !== 'undefined' ? data.get({ plain: true }) : data;

		const finalData: Object = { data: data.data || [], pagination: data.pagination || {} };

		return finalData['data'];
	};

	beforeEach((done) => {
		services = new Query(baseConfig);
		models = setup();

		done();
	});

	it('should check if models exists', (done) => {
		expect(models.users).to.exist;
		expect(models.users.find).to.exist;
		expect(models.users.find).to.be.a('function');
		expect(models.users.findOne).to.exist;
		expect(models.users.findOne).to.be.a('function');
		expect(models.users.insertMany).to.exist;
		expect(models.users.insertMany).to.be.a('function');
		expect(models.users.findOneAndUpdate).to.exist;
		expect(models.users.findOneAndUpdate).to.be.a('function');
		expect(models.users.findOneAndRemove).to.exist;
		expect(models.users.findOneAndRemove).to.be.a('function');

		done();
	});

	it('should mock get all data', (done) => {
		services
			.getAll(models.users, {})
			.then((data) => {
				expect(getfinalData(data)).to.be.a('Array');

				done();
			})
			.catch(done);
	});

	it('should mock get all data with limit', (done) => {
		services
			.getAll(models.users, {}, { limit: 1 })
			.then((data) => {
				expect(getfinalData(data)).to.have.lengthOf(1);

				done();
			})
			.catch(done);
	});

	it('should get one data', (done) => {
		services
			.getOne(models.users, { _id: '644aa3d0595af809a6dfbf75' })
			.then((data) => {
				expect(data).to.be.a('Object');

				done();
			})
			.catch(done);
	});

	it('should get the mongo request', (done) => {
		expect(services.appendRequestQuery({}, 'ENName:LTL|TCName:XXX')).to.have.eql({ ENName: /LTL/i, TCName: /XXX/i });

		done();
	});
});

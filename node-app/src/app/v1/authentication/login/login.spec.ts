import * as supertest from 'supertest';
import { expect } from 'chai';

import app from './../../../../app';
import { LogIn } from './login.component';

describe('login component', () => {
	let application: any;

	before((done) => {
		application = new LogIn('sandbox', null, null, null);

		done();
	});

	it('should have the basic method', (done) => {
		expect(application.updateLastLogIn).to.exist;
		expect(application.updateLastLogIn).to.be.a('function');
		expect(application.updateLoginAttempt).to.exist;
		expect(application.updateLoginAttempt).to.be.a('function');

		done();
	});

	it('should not be allowed to login user', (done) => {
		supertest(app)
			.post('/v1/auth/login?test=true')
			.set('x-node-api-key', 'S3VRbXZueFhFalI3S1h3ZnVjZ2VyVGY2WXdaVjVBbXo1YXd3eGY1UEZna3BHcmIzSm4=')
			.send({
				phoneNumber: '639111111111',
				password: 'random-password',
			})
			.expect('Content-Type', /json/)
			.expect(400, (err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.status).to.equal('failed');

				done();
			});
	});

	it('should login user', (done) => {
		supertest(app)
			.post('/v1/auth/login?test=true')
			.set('x-node-api-key', 'S3VRbXZueFhFalI3S1h3ZnVjZ2VyVGY2WXdaVjVBbXo1YXd3eGY1UEZna3BHcmIzSm4=')
			.send({
				phoneNumber: '639111111111',
				password: '5f4dcc3b5aa765d61d8327deb882cf99',
			})
			.expect('Content-Type', /json/)
			.expect(200, (err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.status).to.equal('success');
				expect(res.body.data).to.be.a('string');

				done();
			});
	});
});

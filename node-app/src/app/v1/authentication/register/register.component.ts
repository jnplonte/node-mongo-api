import { Request, Response } from 'express';
import { CoreMiddleware } from '../../../middlewares/core/core.middleware';

export class Register extends CoreMiddleware {
	constructor(app, private response, private helper, private query) {
		super(app);
	}

	get services() {
		return {
			'POST /register': 'register',
		};
	}

	/**
	 * @api {post} /auth/register register user
	 * @apiVersion 1.0.0
	 * @apiName register
	 * @apiGroup AUTHENTICATION
	 * @apiPermission all
	 *
	 * @apiDescription register user
	 *
	 * @apiBody {String} firstName first name
	 * @apiBody {String} lastName last name
	 * @apiBody {String} phoneNumber unique phone number
	 * @apiBody {String} password MD5 hash password
	 * @apiBody {String} [cityId] city id
	 * @apiBody {String} [roleId] role id
	 */
	register(req: Request, res: Response): void {
		const reqParameters: string[] = ['firstName', 'lastName', 'phoneNumber', 'password'];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const data: any = req.body;

		data['phone'] = this.helper.cleanData(data['phoneNumber']).toString();

		data['salt'] = this.helper.generateRandomString();
		data['password'] = this.helper.getPassword(data['password'], data['salt']);
		data['passwordExpiry'] = this.helper.passwordExpiry;

		data['cityId'] = data['cityId'] ? Number(data['cityId']) : this.helper.defaultCity;
		data['roleId'] = data['roleId'] ? Number(data['roleId']) : this.helper.defaultUserRole;

		if (data['verified']) {
			data['verificationKey'] = '';

			return this.query
				.post(req.models.users, this.helper.cleanData(data))
				.then((user: any) => {
					if (!user || this.helper.isEmptyObject(user)) {
						return Promise.reject('register failed');
					}

					if (user.name === 'MongoServerError') {
						return Promise.reject('invalid phone');
					}

					return this.response.success(res, 'register', { id: user._id, verified: true });
				})
				.catch((error) => this.response.failed(res, 'register', error));
		} else {
			// NOTE: generate OTP
			data['verificationKey'] = this.helper.encode(`${this.helper.generateRandomString(50)}${new Date().getTime()}`);

			return this.query
				.post(req.models.users, this.helper.cleanData(data))
				.then((user: any) => {
					console.log(user.name);
					if (!user || this.helper.isEmptyObject(user)) {
						return Promise.reject('register failed');
					}

					if (user.name === 'MongoServerError') {
						return Promise.reject('invalid phone');
					}

					return this.response.success(res, 'register', { id: user._id, verified: false });
				})
				.catch((error) => this.response.failed(res, 'register', error));
		}
	}
}

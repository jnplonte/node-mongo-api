import { Request, Response } from 'express';
import { CoreMiddleware } from '../../../middlewares/core/core.middleware';

import { UsersAttributes } from './../../../../models/users';

export class ForgotPassword extends CoreMiddleware {
	constructor(app, private response, private helper, private query) {
		super(app);
	}

	get services() {
		return {
			'POST /forgot': 'forgot',
			'POST /forgotsend': 'forgotSend',
		};
	}

	/**
	 * @api {post} /auth/forgot change user password
	 * @apiVersion 1.0.0
	 * @apiName forgot
	 * @apiGroup AUTHENTICATION
	 * @apiPermission all
	 *
	 * @apiDescription forgot user password
	 *
	 * @apiBody {String} forgotPasswordKey forgot password key
	 * @apiBody {String} password MD5 hash password
	 */
	forgot(req: Request, res: Response): void {
		const reqParameters: string[] = ['forgotPasswordKey', 'password'];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const data = req.body;

		const whereData = {
			forgotPasswordKey: data.forgotPasswordKey,
			active: true,
			verified: true,
		};

		data.salt = this.helper.generateRandomString();
		data.password = this.helper.getPassword(req.body.password, req.body.salt);
		data.passwordExpiry = this.helper.passwordExpiry;
		data.forgotPasswordKey = '';
		data.loginAttempt = 0;

		return this.query
			.update(req.models.users, whereData, this.helper.cleanData(data))
			.then((user: UsersAttributes) => {
				if (!user || this.helper.isEmptyObject(user)) {
					return this.response.failed(res, 'forgot-password', '');
				}

				return this.response.success(res, 'forgot-password', user._id);
			})
			.catch((error) => this.response.failed(res, 'forgot-password', error));
	}

	/**
	 * @api {post} /auth/forgotsend send user password otp
	 * @apiVersion 1.0.0
	 * @apiName forgotSend
	 * @apiGroup AUTHENTICATION
	 * @apiPermission all
	 *
	 * @apiDescription send user password otp
	 *
	 * @apiBody {String} phoneNumber phone number
	 */
	forgotSend(req: Request, res: Response): void {
		const reqParameters: string[] = ['phoneNumber'];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const whereData = {
			phone: this.helper.cleanData(req.body.phoneNumber),
			active: true,
			verified: true,
		};

		let forgotPasswordKeyOtp: string = '';
		return req.models.users
			.findOne(whereData)
			.then((user: UsersAttributes) => {
				if (!user || this.helper.isEmptyObject(user)) {
					return this.response.failed(res, 'forgot-password', '');
				}

				forgotPasswordKeyOtp = this.helper.encode(`${this.helper.generateRandomString(50)}${new Date().getTime()}`);

				return this.query.update(
					req.models.users,
					{ _id: user._id },
					{
						forgotPasswordKey: forgotPasswordKeyOtp,
					}
				);
			})
			.then((user: UsersAttributes) => {
				if (!user || this.helper.isEmptyObject(user)) {
					return this.response.failed(res, 'forgot-password', '');
				}

				return this.response.success(res, 'forgot-password', forgotPasswordKeyOtp);
			})
			.catch((error) => this.response.failed(res, 'forgot-password', error));
	}
}

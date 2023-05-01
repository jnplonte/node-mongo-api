import { Request, Response } from 'express';
import { CoreMiddleware } from '../../../middlewares/core/core.middleware';

import { UsersAttributes } from './../../../../models/users';

export class VerifyUser extends CoreMiddleware {
	constructor(app, private response, private helper, private query) {
		super(app);
	}

	get services() {
		return {
			'POST /verify': 'verify',
			'POST /verifysend': 'verifySend',
		};
	}

	/**
	 * @api {post} /auth/verify verify user
	 * @apiVersion 1.0.0
	 * @apiName verify
	 * @apiGroup AUTHENTICATION
	 * @apiPermission all
	 *
	 * @apiDescription verify user
	 *
	 * @apiBody {String} verificationKey verification key
	 * @apiBody {String} phoneNumber phone number
	 */
	verify(req: Request, res: Response): void {
		const reqParameters: string[] = ['verificationKey', 'phoneNumber'];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const data = req.body;

		const whereData = {
			phone: this.helper.cleanData(data.phoneNumber),
			verificationKey: data.verificationKey,
			active: true,
			// verified: false,
		};

		return this.query
			.update(req.models.users, whereData, { verified: true, verificationKey: '' })
			.then((user: UsersAttributes) => {
				if (!user || this.helper.isEmptyObject(user)) {
					return this.response.failed(res, 'verify', '');
				}

				return this.response.success(res, 'verify', user._id);
			})
			.catch((error) => this.response.failed(res, 'verify', error));
	}

	/**
	 * @api {post} /auth/verifysend send verification otp
	 * @apiVersion 1.0.0
	 * @apiName verifysend
	 * @apiGroup AUTHENTICATION
	 * @apiPermission all
	 *
	 * @apiDescription send verification otp
	 *
	 * @apiBody {String} phoneNumber phone number
	 */
	verifySend(req: Request, res: Response): void {
		const reqParameters: string[] = ['phoneNumber'];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const whereData = {
			phone: this.helper.cleanData(req.body.phoneNumber),
			active: true,
			// verified: false,
		};

		let verificationKeyOtp: string = '';
		return req.models.users
			.findOne(whereData)
			.then((user: UsersAttributes) => {
				if (!user || this.helper.isEmptyObject(user)) {
					return this.response.failed(res, 'verify', '');
				}

				// NOTE: generate OTP here
				verificationKeyOtp = this.helper.encode(`${this.helper.generateRandomString(50)}${new Date().getTime()}`);

				return this.query.update(
					req.models.users,
					{ _id: user._id },
					{
						verificationKey: verificationKeyOtp,
					}
				);
			})
			.then((user: UsersAttributes) => {
				if (!user || this.helper.isEmptyObject(user)) {
					return this.response.failed(res, 'verify', '');
				}

				return this.response.success(res, 'verify', verificationKeyOtp);
			})
			.catch((error) => this.response.failed(res, 'verify', error));
	}
}

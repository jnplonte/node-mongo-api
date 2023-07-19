import { Request, Response } from 'express';
import { CoreMiddleware } from '../../../middlewares/core/core.middleware';

import { UsersAttributes } from './../../../../models/users';

export class LogIn extends CoreMiddleware {
	constructor(app, private response, private helper, private query) {
		super(app);
	}

	get services() {
		return {
			'POST /login': 'login',
		};
	}

	/**
	 * @api {post} /auth/login login user
	 * @apiVersion 1.0.0
	 * @apiName login
	 * @apiGroup AUTHENTICATION
	 * @apiPermission all
	 *
	 * @apiDescription authenticate phone number and passowrd
	 *
	 * @apiBody {String} phoneNumber phone number
	 * @apiBody {String} password MD5 hash password
	 * @apiQuery {String} roleId role id <br/>Ex. ?roleId=ADMIN,SHOPADMIN
	 */
	login(req: Request, res: Response): void {
		const reqParameters: string[] = ['phoneNumber', 'password'];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const roleIds: Array<any> = req.query.roleId ? req.query.roleId.toString().split(',') : [];

		const whereData = {
			phone: this.helper.cleanData(req.body.phoneNumber).toString(),
			active: true,
			verified: true,
		};

		if (roleIds.length >= 1) {
			whereData['roleId'] = {
				$in: roleIds,
			};
		}

		let loginInfo: UsersAttributes = {};
		return this.query
			.getOne(req.models.users, whereData)
			.then((user: UsersAttributes) => {
				if (!user || this.helper.isEmptyObject(user)) {
					return Promise.reject('invalid phone');
				}

				loginInfo = user;
				return this.query.getOne(req.models.users, {
					_id: user._id,
					password: this.helper.getPassword(req.body.password, user.salt),
				});
			})
			.then((user: UsersAttributes) => {
				if (!user || this.helper.isEmptyObject(user)) {
					return this.updateLoginAttempt(req.models.users, loginInfo._id, loginInfo.loginAttempt).then(() =>
						Promise.reject('invalid password')
					);
				}

				return this.updateLastLogIn(req.models.users, user._id, user.loginCount).then(() =>
					this.response.success(
						res,
						'login',
						this.helper.createJwtToken({
							id: user._id,
							phone: user.phone,
							roleId: user.roleId,
						})
					)
				);
			})
			.catch((error) => this.response.failed(res, 'login', error));
	}

	private updateLoginAttempt(model: any, id: string = '', loginAttempt: number = 0): Promise<any> {
		return this.query.update(
			model,
			{ _id: id },
			{
				loginAttempt: Number(loginAttempt) + 1,
			}
		);
	}

	private updateLastLogIn(model: any, id: string = '', loginCount: number = 0): Promise<any> {
		return this.query.update(
			model,
			{ _id: id },
			{
				lastLogin: new Date(),
				loginAttempt: 0,
				loginCount: Number(loginCount) + 1,
			}
		);
	}
}

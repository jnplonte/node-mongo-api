import { ROLE_ID } from './constants';

export interface UserLogsAttributes {
	_id?: string;

	userId?: string;
	userData?: object;

	additionalData?: object;

	isOpened?: boolean;
	roleId?: number;
	message?: string;

	createdAt?: Date;
	updatedAt?: Date;
}

export default function userLogsModel(mongoose) {
	const userLogSchema = mongoose.Schema(
		{
			userId: {
				type: String,
				required: true,
			},
			userData: {
				type: Object,
			},

			additionalData: {
				type: Object,
			},

			isOpened: {
				type: Boolean,
				default: false,
			},
			roleId: {
				type: String,
				enum: ROLE_ID,
				default: 'USER',
			},
			message: {
				type: String,
			},

			updatedAt: {
				type: Date,
				default: new Date(),
			},
			createdAt: {
				type: Date,
				default: new Date(),
			},
		},
		{ collation: { locale: 'en', strength: 2 } }
	);

	userLogSchema.index({ userId: 1, roleId: 1, isOpened: 1, createdAt: -1 });

	return {
		name: 'userLogs',
		model: mongoose.model('userLogs', userLogSchema),
	};
}

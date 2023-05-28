import { TRANSACTION_STATUS } from './constants';

export interface WaitingListsAttributes {
	_id?: string;

	shopId?: string;
	shopData?: object;

	userId?: string;
	userName?: string;
	userData?: object;

	waitingTime?: number;
	status?: string;
	remarks?: string;

	createdAt?: Date;
	updatedAt?: Date;
}

export default function waitingListsModel(mongoose) {
	const waitingListSchema = mongoose.Schema(
		{
			shopId: {
				type: String,
				required: true,
			},
			shopData: {
				type: Object,
			},

			userId: {
				type: String,
			},
			userName: {
				type: String,
			},
			userData: {
				type: Object,
			},

			waitingTime: {
				type: Number,
			},
			status: {
				type: String,
				enum: TRANSACTION_STATUS,
				default: 'PENDING',
			},
			remarks: {
				type: String,
			},

			createdAt: {
				type: Date,
				default: new Date(),
			},
			updatedAt: {
				type: Date,
				default: new Date(),
			},
		},
		{ collation: { locale: 'en', strength: 2 } }
	);

	waitingListSchema.index({ shopId: 1, userId: 1, waitingTime: 1, status: 1, createdAt: -1 });

	return {
		name: 'waitingLists',
		model: mongoose.model('waitingLists', waitingListSchema),
	};
}

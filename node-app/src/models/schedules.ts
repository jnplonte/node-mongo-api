import { SCHEDULE_STATUS } from './constants';

export interface SchedulesAttributes {
	_id?: string;

	shopId?: string;
	shopData?: object;

	userId?: string;
	userName?: string;
	userData?: object;

	additionalData?: object;

	dateTime?: Date; // schedule date time
	status?: string;
	remarks?: string;

	createdAt?: Date;
	updatedAt?: Date; // if status is COMPLETED updatedAt is the completedTime
}

export default function schedulesModel(mongoose) {
	const scheduleSchema = mongoose.Schema(
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

			additionalData: {
				type: Object,
			},

			dateTime: {
				type: Date,
				default: new Date(),
			},
			status: {
				type: String,
				enum: SCHEDULE_STATUS,
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

	scheduleSchema.index({ shopId: 1, userId: 1, dateTime: 1, status: 1, createdAt: -1 });

	return {
		name: 'schedules',
		model: mongoose.model('schedules', scheduleSchema),
	};
}

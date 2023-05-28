import { ROLE_ID } from './constants';

export interface UserAttendancesAttributes {
	_id?: string;

	userId?: string;
	userData?: object;

	additionalData?: object; // { lateReason: string; lateTime: number }

	isLate?: boolean; // if createdAt is greather than user.employeeData.startTime
	roleId?: number;
	remarks?: string;

	createdAt?: Date;
	updatedAt?: Date;
}

export default function userAttendancesModel(mongoose) {
	const employeeAttendanceSchema = mongoose.Schema(
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

			isLate: {
				type: Boolean,
				default: false,
			},
			roleId: {
				type: String,
				enum: ROLE_ID,
				default: 'USER',
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

	employeeAttendanceSchema.index({ userId: 1, roleId: 1, isLate: 1, createdAt: -1 });

	return {
		name: 'userAttendances',
		model: mongoose.model('userAttendances', employeeAttendanceSchema),
	};
}

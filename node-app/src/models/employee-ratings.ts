export interface EmployeeRatingsAttributes {
	_id?: string;

	shopId?: string;

	shopEmployeeId?: string;
	shopEmployeeData?: object;

	userId?: string;
	userData?: object;

	additionalData?: object; // { rating: number, comment: string }

	remarks?: string;

	createdAt?: Date;
	updatedAt?: Date;
}

export default function employeeRatingsModel(mongoose) {
	const employeeRatingSchema = mongoose.Schema(
		{
			shopId: {
				type: String,
				required: true,
			},

			shopEmployeeId: {
				type: String,
			},
			shopEmployeeData: {
				type: Object,
			},

			userId: {
				type: String,
			},
			userData: {
				type: Object,
			},

			additionalData: {
				type: Object,
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

	employeeRatingSchema.index({
		shopId: 1,
		shopEmployeeId: 1,
		userId: 1,
		createdAt: -1,
	});

	return {
		name: 'employeeRatings',
		model: mongoose.model('employeeRatings', employeeRatingSchema),
	};
}

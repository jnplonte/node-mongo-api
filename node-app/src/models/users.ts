import { ROLE_ID, LANGUAGE_ID, COUNTRY_ID, CITY_ID } from './constants';

export interface UsersAttributes {
	_id?: string;

	firstName?: string;
	lastName?: string;
	birthDate?: string;
	phone?: string;
	email?: string;
	password?: string;
	salt?: string;
	forgotPasswordKey?: string;
	lastLogin?: Date;
	loginCount?: number;

	roleId?: string;
	languageId?: string;
	countryId?: string;
	cityId?: string;
	postalName?: string;
	postalId?: number;

	socialMedia?: {
		facebook?: string;
		instagram?: string;
		tiktok?: string;
		twitter?: string;
		website?: string;
	};

	// NOTE: if role is SHOPUSER baseRate, isCommissionBased, commissionPercentage are mandatory
	// NOTE: if role is SHOPEMPLOYEE baseRate, isCommissionBased, serviceCommissionPercentage are mandatory
	employeeData?: {
		workingDays?: number[]; // [1,2,3,4,5,6,7]
		startTime?: number;
		endTime?: number;

		rating?: number;

		baseRate: number;
		isCommissionBased: boolean;
		commissionPercentage: number;
		serviceCommissionPercentage: number;
		productCommissionPercentage: number;
	};

	additionalData?: object;

	active?: boolean;
	verified?: boolean;
	verificationKey?: string;

	loginAttempt?: number;
	passwordExpiry?: Date;

	createdAt?: Date;
	updatedAt?: Date;
}

export default function usersModel(mongoose) {
	const userSchema = mongoose.Schema(
		{
			firstName: {
				type: String,
				required: true,
			},
			lastName: {
				type: String,
				required: true,
			},
			birthDate: {
				type: String,
			},
			phone: {
				type: String,
				required: true,
			},
			email: {
				type: String,
			},

			password: {
				type: String,
			},
			salt: {
				type: String,
			},
			forgotPasswordKey: {
				type: String,
			},

			lastLogin: {
				type: Date,
				default: new Date(),
			},
			loginCount: {
				type: Number,
				default: 0,
			},

			roleId: {
				type: String,
				enum: ROLE_ID,
				default: 'USER',
			},
			languageId: {
				type: String,
				enum: LANGUAGE_ID,
				default: 'ENGLISH',
			},
			countryId: {
				type: String,
				enum: COUNTRY_ID,
				default: 'NONE',
			},
			cityId: {
				type: String,
				enum: CITY_ID,
				default: 'NONE',
			},
			postalName: {
				type: String,
			},
			postalId: {
				type: Number,
			},

			socialMedia: {
				facebook: {
					type: String,
					default: '',
				},
				instagram: {
					type: String,
					default: '',
				},
				tiktok: {
					type: String,
					default: '',
				},
				twitter: {
					type: String,
					default: '',
				},
				website: {
					type: String,
					default: '',
				},
			},
			employeeData: {
				workingDays: {
					type: Array,
					default: [],
				},
				startTime: {
					type: Number,
					default: 0,
				},
				endTime: {
					type: Number,
					default: 0,
				},

				rating: {
					type: Number,
					default: 0,
				},

				baseRate: {
					type: Number,
					default: 0,
				},
				isCommissionBased: {
					type: Boolean,
					default: false,
				},
				commissionPercentage: {
					type: Number,
					default: 0,
				},
				serviceCommissionPercentage: {
					type: Number,
					default: 0,
				},
				productCommissionPercentage: {
					type: Number,
					default: 0,
				},
			},
			additionalData: {
				type: Object,
			},

			active: {
				type: Boolean,
				default: true,
			},
			verified: {
				type: Boolean,
				default: false,
			},
			verificationKey: {
				type: String,
			},

			loginAttempt: {
				type: Number,
				default: 0,
			},
			passwordExpiry: {
				type: Date,
				default: new Date(),
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

	userSchema.index({ phone: 1, roleId: 1, cityId: 1, postalId: 1, createdAt: -1 });
	userSchema.index({ phone: 1 }, { unique: true });

	return {
		name: 'users',
		model: mongoose.model('users', userSchema),
	};
}

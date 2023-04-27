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

	socialMedia?: object;
	additionalData?: object;

	active?: boolean;
	verified?: boolean;
	verificationKey?: string;

	loginAttempt?: number;
	passwordExpiry?: Date;

	createdAt?: Date;
	updatedAt?: Date;
}

export default function userModel(mongoose) {
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
				enum: ['ADMIN', 'USER', 'CUSTOMERADMIN', 'CUSTOMERUSER'],
				default: 'USER',
			},
			languageId: {
				type: String,
				enum: ['ENGLISH', 'TAGALOG'],
				default: 'ENGLISH',
			},
			countryId: {
				type: String,
				enum: ['NONE', 'PHILIPPINES'],
				default: 'NONE',
			},
			cityId: {
				type: String,
				enum: ['NONE', 'QUEZONCITY', 'MANDALUYONGCITY', 'PASIGCITY'],
				default: 'NONE',
			},
			postalName: {
				type: String,
			},
			postalId: {
				type: Number,
			},

			socialMedia: {
				type: Object,
			},
			additionalData: {
				type: Object,
			},

			active: {
				type: Boolean,
				default: false,
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

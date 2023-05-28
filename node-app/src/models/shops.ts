import { COUNTRY_ID, CITY_ID } from './constants';

export interface ShopsAttributes {
	_id?: string;

	name?: string;
	code?: string;
	picture1?: string;
	picture2?: string;
	description?: string;

	address?: string;
	longitude?: number;
	latitude?: number;
	phone?: string;
	email?: string;

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
	additionalData?: object;
	active?: boolean;

	createdAt?: Date;
	updatedAt?: Date;
}

export default function shopsModel(mongoose) {
	const shopSchema = mongoose.Schema(
		{
			name: {
				type: String,
				required: true,
			},
			code: {
				type: String,
				required: true,
			},
			picture1: {
				type: String,
			},
			picture2: {
				type: String,
			},
			description: {
				type: String,
			},

			address: {
				type: String,
			},
			longitude: {
				type: Number,
			},
			latitude: {
				type: Number,
			},
			phone: {
				type: String,
			},
			email: {
				type: String,
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
			additionalData: {
				type: Object,
			},
			active: {
				type: Boolean,
				default: true,
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

	shopSchema.index({ code: 1, cityId: 1, postalId: 1, createdAt: -1 });

	return {
		name: 'shops',
		model: mongoose.model('shops', shopSchema),
	};
}

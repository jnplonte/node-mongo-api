export interface ShopProductsAttributes {
	_id?: string;

	shopId?: string;

	name?: string;
	code?: string;
	picture1?: string;
	picture2?: string;
	description?: string;

	price?: number;
	discount?: number;

	active?: boolean;

	createdAt?: Date;
	updatedAt?: Date;
}

export default function shopProductsModel(mongoose) {
	const shopProductSchema = mongoose.Schema(
		{
			shopId: {
				type: String,
				required: true,
			},

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

			price: {
				type: Number,
			},
			discount: {
				type: Number,
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

	shopProductSchema.index({ shopId: 1, createdAt: -1 });

	return {
		name: 'shopProducts',
		model: mongoose.model('shopProducts', shopProductSchema),
	};
}

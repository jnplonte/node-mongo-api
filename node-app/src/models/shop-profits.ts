export interface ShopProfitsAttributes {
	_id?: string;

	shopId?: string;

	month?: number; // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
	year?: number; // 2023
	income?: number;
	expense?: number;
	total?: number; // total profit (income - expense)

	createdAt?: Date;
	updatedAt?: Date;
}

export default function shopProfitsModel(mongoose) {
	const shopProfitsSchema = mongoose.Schema(
		{
			shopId: {
				type: String,
				required: true,
			},

			month: {
				type: Number,
			},
			year: {
				type: Number,
			},
			income: {
				type: Number,
			},
			expense: {
				type: Number,
			},
			total: {
				type: Number,
			},

			updatedAt: {
				type: Date,
				default: Date.now,
			},
			createdAt: {
				type: Date,
				default: Date.now,
			},
		},
		{ collation: { locale: 'en', strength: 2 } }
	);

	shopProfitsSchema.index({ shopId: 1, month: 1, year: 1, createdAt: -1 });

	return {
		name: 'shopProfits',
		model: mongoose.model('shopProfits', shopProfitsSchema),
	};
}

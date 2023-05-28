export interface ShopExpensesAttributes {
	_id?: string;

	shopId?: string;

	name?: string;
	description?: string;

	month?: number; // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
	year?: number; // 2023
	total?: number; // total expense sum of summary

	summary?: Array<any>; // [{ name: string, price: number}]
	remarks?: string;

	createdAt?: Date;
	updatedAt?: Date;
}

export default function shopExpensesModel(mongoose) {
	const shopExpensesSchema = mongoose.Schema(
		{
			shopId: {
				type: String,
				required: true,
			},

			name: {
				type: String,
			},
			description: {
				type: String,
			},

			month: {
				type: Number,
			},
			year: {
				type: Number,
			},
			total: {
				type: Number,
			},

			summary: {
				type: Array,
				default: [],
			},
			remarks: {
				type: String,
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

	shopExpensesSchema.index({ shopId: 1, month: 1, year: 1, createdAt: -1 });

	return {
		name: 'shopExpenses',
		model: mongoose.model('shopExpenses', shopExpensesSchema),
	};
}

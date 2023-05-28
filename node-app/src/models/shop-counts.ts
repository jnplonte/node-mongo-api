export interface ShopCountsAttributes {
	_id?: string;

	shopId?: string;

	transactionCount?: number;
	productCount?: number;
	serviceCount?: number;

	totalPoints?: number;
	givenPoints?: number;
	redeemPoints?: number;

	openDays?: number[]; // [1,2,3,4,5,6,7]
	openHours?: number; // opening hours
	closeHours?: number; // closing hours

	baseRate?: number; // default employee base rate
	commissionPercentage?: number; // default employee commision
	serviceCommissionPercentage?: number; // default employee service commission
	productCommissionPercentage?: number; // default employee product commission

	createdAt: Date;
	updatedAt: Date;
}

export default function shopCountsModel(mongoose) {
	const shopCountSchema = mongoose.Schema(
		{
			shopId: {
				type: String,
				required: true,
			},

			transactionCount: {
				type: Number,
				default: 0,
			},
			productCount: {
				type: Number,
				default: 0,
			},
			serviceCount: {
				type: Number,
				default: 0,
			},

			totalPoints: {
				type: Number,
				default: 0,
			},
			givenPoints: {
				type: Number,
				default: 0,
			},
			redeemPoints: {
				type: Number,
				default: 0,
			},

			openDays: {
				type: Number,
				default: 0,
			},
			openHours: {
				type: Number,
				default: 0,
			},
			closeHours: {
				type: Number,
				default: 0,
			},

			baseRate: {
				type: Number,
				default: 0,
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

	shopCountSchema.index({
		shopId: 1,
		transactionCount: 1,
		productCount: 1,
		serviceCount: 1,
		totalPoints: 1,
		givenPoints: 1,
		redeemPoints: 1,
		createdAt: -1,
	});

	return {
		name: 'shopCounts',
		model: mongoose.model('shopCounts', shopCountSchema),
	};
}

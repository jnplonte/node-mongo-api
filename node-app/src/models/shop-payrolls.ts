export interface ShopPayrollsAttributes {
	_id?: string;

	shopId?: string;

	userId?: string;
	userData?: object;

	name?: string;
	description?: string;

	month?: number; // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
	year?: number; // 2023
	workingDays?: number; // total number employee goes to work
	totalDays?: number; // total days of the cut-off

	summary?: {
		contributions?: Array<any>; // [{ name: string, price: number}]
		baseRate?: number; // from users.employeeData.baseRate
		isCommissionBased?: boolean; // from users.employeeData.isCommissionBased

		serviceIncome?: number; // total income based on transactions
		serviceCommissionPercentage?: number; // from users.employeeData.serviceCommissionPercentage
		serviceTotal?: number; // serviceIncome * (serviceCommissionPercentage / 100)

		productIncome?: number; // total income based on transactions
		productCommissionPercentage?: number; // from users.employeeData.productCommissionPercentage
		productTotal?: number; // productIncome * (productCommissionPercentage / 100)
	};

	baseTotal?: number; // base rate if isCommissionBased is false, 0 if isCommissionBased is true
	serviceTotal?: number; // summary.serviceTotal
	productTotal?: number; // summary.productTotal

	bonus?: number;
	deduction?: number;

	total?: number; // total salary (baseTotal + serviceTotal + productTotal + bonus - deduction)
	remarks?: string;

	recieved?: boolean; // if payroll has been received
	receivedAt?: Date; // date time of payroll received

	updatedAt?: Date;
	createdAt?: Date;
}

export default function shopPayrollsModel(mongoose) {
	const shopPayrollsSchema = mongoose.Schema(
		{
			shopId: {
				type: String,
				required: true,
			},

			userId: {
				type: String,
				required: true,
			},
			userData: {
				type: Object,
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
			workingDays: {
				type: Number,
			},
			totalDays: {
				type: Number,
			},

			summary: {
				contributions: {
					type: Array,
					default: [],
				},
				baseRate: {
					type: Number,
					default: 0,
				},
				isCommissionBased: {
					type: Boolean,
					default: false,
				},

				serviceIncome: {
					type: Number,
					default: 0,
				},
				serviceCommission: {
					type: Number,
					default: 0,
				},
				serviceTotal: {
					type: Number,
					default: 0,
				},

				productIncome: {
					type: Number,
					default: 0,
				},
				productCommission: {
					type: Number,
					default: 0,
				},
				productTotal: {
					type: Number,
					default: 0,
				},
			},

			baseTotal: {
				type: Number,
				default: 0,
			},
			serviceTotal: {
				type: Number,
				default: 0,
			},
			productTotal: {
				type: Number,
				default: 0,
			},
			bonus: {
				type: Number,
				default: 0,
			},
			deduction: {
				type: Number,
				default: 0,
			},
			total: {
				type: Number,
				default: 0,
			},
			remarks: {
				type: String,
			},

			recieved: {
				type: Boolean,
				default: false,
			},
			receivedAt: {
				type: Date,
				default: null,
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

	shopPayrollsSchema.index({ shopId: 1, userId: 1, month: 1, year: 1, recieved: 1, createdAt: -1 });

	return {
		name: 'shopPayrolls',
		model: mongoose.model('shopPayrolls', shopPayrollsSchema),
	};
}

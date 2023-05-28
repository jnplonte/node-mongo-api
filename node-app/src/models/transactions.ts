import { TRANSACTION_STATUS, TRANSACTION_TYPES } from './constants';

export interface TransactionsAttributes {
	_id?: string;

	shopId?: string;
	shopData?: object;

	shopUserId?: string;
	shopUserData?: object;
	shopEmployeeId?: string;
	shopEmployeeData?: object;

	userId?: string;
	userName?: string;
	userData?: object;

	productId?: string[];
	productData?: Array<any>;

	serviceId?: string[];
	serviceData?: Array<any>;

	additionalData?: object; // { quantity: number, price: number, discount: number, total: number, modeOfPayment: string, paymentReference: string, payment: number, change: number }

	type?: string;
	status?: string;
	remarks?: string;

	createdAt?: Date;
	updatedAt?: Date; // if status is COMPLETED updatedAt is the completedTime
}

export default function transactionsModel(mongoose) {
	const transactionSchema = mongoose.Schema(
		{
			shopId: {
				type: String,
				required: true,
			},
			shopData: {
				type: Object,
			},

			shopUserId: {
				type: String,
				required: true,
			},
			shopUserData: {
				type: Object,
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
			userName: {
				type: String,
			},
			userData: {
				type: Object,
			},

			productId: {
				type: [String],
			},
			productData: {
				type: Array,
			},

			serviceId: {
				type: [String],
			},
			serviceData: {
				type: Array,
			},

			additionalData: {
				type: Object,
			},

			type: {
				type: String,
				enum: TRANSACTION_TYPES,
				default: 'NONE',
			},
			status: {
				type: String,
				enum: TRANSACTION_STATUS,
				default: 'PENDING',
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

	transactionSchema.index({
		shopId: 1,
		shopUserId: 1,
		shopEmployeeId: 1,
		userId: 1,
		productId: 1,
		serviceId: 1,
		type: 1,
		status: 1,
		createdAt: -1,
	});

	return {
		name: 'transactions',
		model: mongoose.model('transactions', transactionSchema),
	};
}

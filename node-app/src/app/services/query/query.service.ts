import { Helper } from './../helper/helper.service';

import { Types } from 'mongoose';

export class Query {
	helper: Helper;

	constructor(private config) {
		this.helper = new Helper(this.config);
	}

	post(model, data: Object = {}) {
		data['createdAt'] = new Date();
		data['updatedAt'] = new Date();

		return new model(data)
			.save()
			.then((dataVal) => dataVal || {})
			.catch((error) => error);
	}

	postBulk(model, data: Array<any> = []) {
		data = data.map((dData) => {
			dData['createdAt'] = new Date();
			dData['updatedAt'] = new Date();

			return dData;
		});

		return model
			.insertMany(data)
			.then((dataVal) => dataVal || [])
			.catch((error) => error);
	}

	getId(model, id: string = '') {
		return model
			.findById(id)
			.then((dataVal) => (dataVal ? dataVal.toObject() : {}))
			.catch((error) => error);
	}

	getOne(model, query: Object = {}) {
		if (this.helper.isNotEmpty(query['_id'])) {
			query['_id'] = new Types.ObjectId(query['_id']);
		}

		return model
			.findOne(query, {}, { sort: { createdAt: -1 } })
			.then((dataVal) => (dataVal ? dataVal.toObject() : {}))
			.catch((error) => error);
	}

	getAll(model, data: Object = {}, reqQuery: Object = {}, fields = []): Promise<any> {
		data = this.helper.cleanData(data);

		const page: number = typeof reqQuery['page'] !== 'undefined' ? Number(reqQuery['page']) : 1;
		const limit: number = typeof reqQuery['limit'] !== 'undefined' ? Number(reqQuery['limit']) : 10;
		const offset: number = limit * (page - 1);

		const sortAt: string = typeof reqQuery['sortAt'] !== 'undefined' ? reqQuery['sortAt'] : 'DESC';
		const sortBy: string = typeof reqQuery['sortBy'] !== 'undefined' ? reqQuery['sortBy'] : 'createdAt';

		if (typeof reqQuery['query'] !== 'undefined') {
			data = this.appendRequestQuery(data, reqQuery['query']);
		}

		if (typeof reqQuery['queryArray'] !== 'undefined') {
			data = this.appendRequestQueryArray(data, reqQuery['queryArray']);
		}

		return model.countDocuments(data).then((count: number) =>
			model
				.find(data, fields.length >= 1 ? fields : null)
				.sort({ [sortBy]: sortAt === 'DESC' ? -1 : 1 })
				.skip(offset)
				.limit(limit)
				.then((dataValue) => {
					const allPagination: Object = {};

					allPagination['totalData'] = count ? Number(count) : 0;
					allPagination['totalPage'] = Number(Math.ceil(allPagination['totalData'] / limit));
					allPagination['currentPage'] = Number(page);

					if (dataValue.length >= 1) {
						dataValue = dataValue.map((dData) => dData.toObject());
					}

					return { data: dataValue || [], pagination: allPagination };
				})
		);
	}

	getDistinct(model, data: Object = {}, reqQuery: Object = {}, key: string = ''): Promise<any> {
		data = this.helper.cleanData(data);

		return model
			.find(data)
			.distinct(key)
			.then((dataValue) => {
				if (dataValue.length >= 1) {
					dataValue = dataValue.map((dData) => dData.toObject());
				}

				return { data: dataValue || [], pagination: {} };
			});
	}

	getAllField(model, query: Object = {}) {
		return model
			.find(query, null)
			.sort({ createdAt: -1 })
			.then((dataValue) => {
				if (dataValue.length >= 1) {
					dataValue = dataValue.map((dData) => dData.toObject());
				}

				return dataValue;
			})
			.catch((error) => error);
	}

	update(model, query: Object = {}, data: Object = {}) {
		data['updatedAt'] = new Date();

		if (this.helper.isNotEmpty(query['_id'])) {
			query['_id'] = new Types.ObjectId(query['_id']);
		}

		return model
			.findOneAndUpdate(query, { $set: data }, { new: true })
			.then((dataVal) => dataVal)
			.catch((error) => error);
	}

	updateAll(model, query: Object = {}, data: Object = {}) {
		data['updatedAt'] = new Date();

		if (this.helper.isNotEmpty(query['_id'])) {
			if (this.helper.isNotEmpty(query['_id']['$in'])) {
				query['_id']['$in'] = this.convertObjectArray(query['_id']['$in']);
			} else {
				query['_id'] = new Types.ObjectId(query['_id']);
			}
		}

		return model
			.updateMany(query, { $set: data }, { new: true })
			.then((dataVal) => {
				if (dataVal.nModified && dataVal.nModified >= 1) {
					return model.find(query).sort({ createdAt: -1 });
				} else {
					return [];
				}
			})
			.catch((error) => error);
	}

	updateIncrement(model, query: Object = {}, data: Object = {}) {
		if (this.helper.isNotEmpty(query['_id'])) {
			query['_id'] = new Types.ObjectId(query['_id']);
		}

		return model
			.findOneAndUpdate(query, { $set: { updatedAt: new Date() }, $inc: data }, { new: true })
			.then((dataVal) => dataVal)
			.catch((error) => error);
	}

	updatePushIncrement(model, query: Object = {}, data: Object = {}, dataIncrement: Object = {}) {
		if (this.helper.isNotEmpty(query['_id'])) {
			query['_id'] = new Types.ObjectId(query['_id']);
		}

		return model
			.findOneAndUpdate(query, { $set: { updatedAt: new Date() }, $addToSet: data, $inc: dataIncrement }, { new: true })
			.then((dataVal) => dataVal)
			.catch((error) => error);
	}

	delete(model, query: Object = {}) {
		if (this.helper.isNotEmpty(query['_id'])) {
			query['_id'] = new Types.ObjectId(query['_id']);
		}

		return model
			.findOneAndRemove(query)
			.then((dataVal) => dataVal)
			.catch((error) => error);
	}

	deleteAll(model, query: Object = {}) {
		if (this.helper.isNotEmpty(query['_id'])) {
			query['_id'] = new Types.ObjectId(query['_id']);
		}

		return model
			.deleteMany(query)
			.then((dataVal) => dataVal)
			.catch((error) => error);
	}

	count(model, query: Object = {}) {
		return model
			.countDocuments(query)
			.then((dataVal) => dataVal)
			.catch((error) => error);
	}

	protected convertObjectArray(data: string[] = []): Array<any> {
		return data.map((dData) => new Types.ObjectId(dData));
	}

	private appendRequestQuery(whereData: Object = {}, reqQuery: string = ''): Object {
		const reqQueryArray: Array<any> = reqQuery.split('|');
		const finalQuery: Object = {};

		reqQueryArray.forEach((val: any) => {
			const valArray: Array<any> = val.split(':');
			if (valArray[0] && valArray[1]) {
				let splitArray: Array<any> = valArray[1].toString().split(',');
				if (splitArray.length > 1) {
					splitArray = splitArray.map((splitval) => (splitval === 'null' ? '' : new RegExp(splitval, 'i')));

					finalQuery[valArray[0]] = { $in: splitArray };
				} else {
					if (valArray[1] === 'null') {
						finalQuery[valArray[0]] = '';
					} else {
						// finalQuery[valArray[0]] = (this.helper.isInteger(valArray[1])) ? valArray[1] : new RegExp(valArray[1], 'i');
						finalQuery[valArray[0]] = new RegExp(valArray[1], 'i');
					}
				}
			}
		});

		return { ...whereData, ...finalQuery };
	}

	private appendRequestQueryArray(whereData: Object = {}, reqQuery: string = ''): Object {
		const reqQueryArray: Array<any> = reqQuery.split('|');
		const finalQuery: Object = {};

		reqQueryArray.forEach((val: any) => {
			const valKeyArray: Array<any> = val.split('.');

			if (valKeyArray[0] && valKeyArray[1]) {
				if (!finalQuery[valKeyArray[0]]) {
					finalQuery[valKeyArray[0]] = {};
					finalQuery[valKeyArray[0]]['$elemMatch'] = {};
				}

				const valArray: Array<any> = valKeyArray[1].split(':');
				if (valArray[0] && valArray[1]) {
					let splitArray: Array<any> = valArray[1].toString().split(',');
					if (splitArray.length > 1) {
						splitArray = splitArray.map((splitval) => (splitval === 'null' ? '' : new RegExp(splitval, 'i')));
						finalQuery[valKeyArray[0]]['$elemMatch'][valArray[0]] = { $in: splitArray };
					} else {
						if (valArray[1] === 'null') {
							finalQuery[valKeyArray[0]]['$elemMatch'][valArray[0]] = '';
						} else {
							// finalQuery[valKeyArray[0]]['$elemMatch'][valArray[0]] = (this.helper.isInteger(valArray[1])) ? valArray[1] : new RegExp(valArray[1], 'i');
							finalQuery[valKeyArray[0]]['$elemMatch'][valArray[0]] = new RegExp(valArray[1], 'i');
						}
					}
				}
			}
		});

		return { ...whereData, ...finalQuery };
	}
}

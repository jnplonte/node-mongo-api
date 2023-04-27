'use strict';

import * as fs from 'fs';
import * as path from 'path';

import * as mongoose from 'mongoose';

import { baseConfig } from './../config';

export function seed() {
	const basename = path.basename(__filename);
	const env = process.env.NODE_ENV || 'local';
	const db = {};

	const config = baseConfig.database[env];

	mongoose.set('strictQuery', false);
	if (env !== 'production') {
		mongoose.set('debug', true);
	}

	if (mongoose.connection.readyState === 0) {
		const mongoOptions: any = {
			useUnifiedTopology: true,
		};
		mongoose.connect(
			`mongodb://${config['username']}:${config['password']}@${config['host']}:${config['port']}/${config['database']}`,
			mongoOptions
		);
		mongoose.connection.on('connected', (err) => {
			if (err) {
				console.error('mongo connection error:', err);
			} else {
				console.log('mongo connection success');
			}
		});
		mongoose.connection.on('error', console.error.bind(console, 'mongo connection error:'));
	}

	fs.readdirSync(path.resolve('./dist/models'))
		.filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
		.forEach((file) => {
			if (file !== 'index.js') {
				const model = require(path.join(path.resolve('./dist/models'), file)).default(mongoose);
				db[model.name] = model.model;
			}
		});

	// NOTE: add 3 seconds delay
	setTimeout(() => {
		console.log('seeding start');

		fs.readdirSync(__dirname)
			.filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
			.forEach((file) => {
				if (file !== 'index.js') {
					const faker = require(path.join(`${__dirname}`, file)).default(mongoose);
					db[faker['name']]
						.insertMany(faker['seed'])
						.then((data) => {
							console.log(faker['name'], 'seed success');
						})
						.catch((error) => {
							console.log('seed error', error);
						});
				}
			});
	}, 3000);
}

seed();
